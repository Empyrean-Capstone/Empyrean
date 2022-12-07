from flask import Flask, request
from flask_cors import CORS
import time, requests


# import other routing and backend files
#import testpage2

cors = CORS()

app = Flask(__name__)
cors.init_app(app)

@app.route('/planets')
def get_current_time():
    return { 'time': time.time() }

@app.route('/submit', methods=['POST'], strict_slashes=False)
def submit_planet():
    planet_data = request.get_json()

    r = requests.post("http://localhost:5001/request", data={planet_data})

    return {"planet" : planet_data['name']}
