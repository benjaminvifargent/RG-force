from flask import Flask, render_template
from flask_socketio import SocketIO
import board
import busio
import adafruit_ads1x15.ads1115 as ADS # Importé en tant que ADS
from adafruit_ads1x15.analog_in import AnalogIn
import eventlet

# --- Initialisation Hardware ---
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
# Utilisation de ADS.P0 pour pointer vers la constante correcte
chan = AnalogIn(ads, ADS.P0) 

app = Flask(__name__)
# On s'assure que SocketIO utilise eventlet pour le mode asynchrone
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

@app.route('/')
def index():
    # Flask cherchera index.html dans le dossier /templates
    return render_template('index.html')

def read_sensor():
    while True:
        # Lecture de la valeur brute du MCP3008/ADS1115
        raw_value = chan.value
        
        # Calibration : Ajuste ces chiffres après tes premiers tests
        # 500 est le "bruit" à vide, 250 est le diviseur pour tomber sur des KG
        force_kg = max(0, (raw_value - 500) / 250)
        
        # Envoi vers le JavaScript (script.js)
        socketio.emit('force_update', {'value': round(force_kg, 1)})
        socketio.sleep(0.05) # 20Hz pour une jauge fluide

if __name__ == '__main__':
    # Lance la lecture du capteur en tâche de fond
    eventlet.spawn(read_sensor)
    # Le serveur est accessible sur le port 5000[cite: 2]
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)