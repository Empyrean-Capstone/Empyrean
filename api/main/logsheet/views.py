from flask_socketio import SocketIO, emit
from . import logsheet
from .. import sio
from ..models.observation import Observation


# TODO change this to a get request
@sio.on("retrieveObservations")
def get_all_log_data(data):
    observations = Observation.query.all()

    data =  [list(row) for row in observations]

    emit("setObservations", data)
