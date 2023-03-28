from flask_socketio import SocketIO, emit
from main import db
from datetime import datetime, timezone
from . import logsheet
from .. import sio
from ..models.observation import Observation, get_logs_json_str
from ..models.logsheet import Logsheet


def create_logsheet(dict_data : dict):
    logsheet_id = dict_data["log_id"]

    if logsheet_id == "New Logsheet":
        current_logsheet = Logsheet(dict_data)

        current_date = datetime.now(timezone.utc)
        date_number = current_date.strftime("%Y%m%d")

        starting_id = Logsheet.query.filter( Logsheet.date_number==date_number ).count() + 1

        print(starting_id)

        current_logsheet.starting_id = starting_id

        db.session.add(current_logsheet)
        db.session.commit()
    else:
        current_logsheet = Logsheet.query.filter( Logsheet.id==logsheet_id ).first()

    logsheet_name = current_logsheet.date_number + "." + str(current_logsheet.starting_id).zfill(3)

    sio.emit("updateCurrentLogsheet", {"log_id": current_logsheet.id,
                                       "log_name": logsheet_name})

    return current_logsheet

# TODO change this to a get request
@sio.on("retrieveObservations")
def get_all_log_data(data):
    """
    TODO.

    Args:
        data ():
    """
    observations = Observation.query.filter( Observation.log_id==data["log_id"]).all()

    sio.emit("setObservations", get_logs_json_str(observations))

@sio.on("retrieveLogsheets")
def get_all_logsheets(data):
    logsheets = Logsheet.query.all()

    data = [list(row) for row in logsheets]

    emit("setLogsheets", data)
