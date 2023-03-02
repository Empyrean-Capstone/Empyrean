from flask_socketio import SocketIO, emit
from . import logsheet
from .. import sio
from ..models.observation import Observation


# TODO change this to a get request 
@sio.on("retrieveLogsheetData")
def handle_chat(data):
    # Initialize data object to send back
    data = []
    
    # Query entire database table, returns id, obs id, target, progress, date, and signal_to_noise
    dbQuery = Observation.query.all()
    
    for row in dbQuery:
        data.append(str(row).split("|"))
    emit("retrieveLogsheetData", data)