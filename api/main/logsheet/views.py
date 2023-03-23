"""TODO."""

from . import logsheet
from .. import sio
from ..models.observation import Observation, get_logs_json_str


# TODO change this to a get request
@sio.on("retrieveObservations")
def get_all_log_data():
    """
    TODO.

    Args:
        data ():
    """
    observations = Observation.query.all()
    sio.emit("setObservations", get_logs_json_str(observations))
