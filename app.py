from flask import Flask, render_template
from flask_socketio import SocketIO
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import eventlet

# Initialisation Hardware
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
chan = AnalogIn(ads, ADS.P0)

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

def read_sensor():
    while True:
        # Conversion brute en KG (à ajuster selon tes tests)
        force_kg = max(0, (chan.value - 500) / 250)
        socketio.emit('force_update', {'value': round(force_kg, 1)})
        socketio.sleep(0.05)

if __name__ == '__main__':
    eventlet.spawn(read_sensor)
    socketio.run(app, host='0.0.0.0', port=5000)