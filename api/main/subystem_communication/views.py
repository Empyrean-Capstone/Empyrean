from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import time, requests
from . import subsystem_communication


# import other routing and backend files
#import testpage2


app = Flask(__name__)
cors = CORS(app)

@subsystem_communication.route('/planets')
def get_current_time():
    return { 'time': time.time() }

@subsystem_communication.route('/submit', methods=['POST'], strict_slashes=False)
@cross_origin()
def submit_planet():
    planet_data = request.get_json()
    print( planet_data )
    print( '//////////////////////')

    r = requests.post("http://localhost:5001/request", data=planet_data)

    return {"planet" : planet_data['name']}

@subsystem_communication.route('/response', methods=['POST'])
@cross_origin()
def response():
    print( request.form )
    print( "response recieved" )
    return "response recieved"