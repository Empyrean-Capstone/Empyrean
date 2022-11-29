from flask import Flask
import time


# import other routing and backend files
import testpage2


app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return { 'time': time.time() }
