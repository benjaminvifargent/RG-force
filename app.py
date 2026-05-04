import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
from flask import Flask, render_template
from flask_socketio import SocketIO
import eventlet

# --- Initialisation Hardware ---
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)

# Utilisation de l'index 0 directement si ADS.P0 pose problème
try:
    chan = AnalogIn(ads, ADS.P0)
except:
    chan = AnalogIn(ads, 0)

# --- Configuration Flask ---
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    # Flask cherche dans le dossier /templates
    return render_template('index.html')

baseline = None

def read_sensor():
    global baseline
    # Attendre un court instant pour que le capteur se stabilise
    socketio.sleep(1)
    
    while True:
        raw_value = chan.value
        
        # Au démarrage, on définit la valeur actuelle comme le zéro (tare)
        if baseline is None:
            baseline = raw_value
            print(f"Capteur calibré. Baseline (0kg) = {baseline}")

        # Inversion de la logique :
        # Plus on serre, plus la résistance baisse, plus le raw_value baisse (selon ton montage)
        # On calcule donc la différence par rapport au repos
        force_raw = baseline - raw_value
        
        # On divise par 250 (à ajuster pour la précision des KG)
        force_kg = max(0, force_raw / 350)
        
        # Envoi de la donnée
        socketio.emit('force_update', {'value': round(force_kg, 1)})
        socketio.sleep(0.05)

if __name__ == '__main__':
    eventlet.spawn(read_sensor)
    socketio.run(app, host='0.0.0.0', port=5000)