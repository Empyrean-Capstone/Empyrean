"""TODO."""

import json

from main import db
from .. import sio
from . import status
from ..models import Status, Instrument

# FIXME: must have a way to designate the current camera
def get_current_camera() -> int:
    """
    Gets the most recent camera in use
    
    Returns:
    --------
        int:
            The indentifier of the camera currently in use
    """
    return Instrument.query.filter_by(instrumentName="ZWO ASI120MM-S").first().instrumentId


def get_current_obsid() -> int:
    """
    Finds the status of the current camera, looking for the observation id 
    of the current observation
    
    Returns:
    --------
        int
            The id of the current observation in the eyes of the database
    """
    cur_camera_id: int = get_current_camera()

    # There is a status that every camera must have and update which is
    # the id of the observation being taken
    cur_camera_status = Status.query.filter_by(
        instrumentID=cur_camera_id, statusName="obs_id").first()

    cur_obsid: int = int(cur_camera_status.statusValue)

    return cur_obsid

@status.get('/index')
def index():
    """
    Returns all of the statuses in the database.
    Used on the frontpage for management. These are the values on load which are 
    then updated in real time
    
    Returns: 
    --------
        list
            List of all of the serialized statuses. A serialized status is a 
            simplified version of the status, only including what is needed for
            the status table to preset the data. See the /main/models/status.py
            for details on what the serialize function does.
    """
    result = Status.query.all()
    for index in range(len(result)):
        result[index] = result[index].serialize()
    return result

@sio.on("get_instrument_id")
def get_instrument_id(instrument_name) -> int:
    """
    On the bootup of an instrument to be connected to this app, it must obtain
    its database identification number from the database. This provides the id,
    where if that instrument has been connected before, its database id is returned
    but if not, a new instrument is created and that id is returned

    Returns:
        int
            The database id of the instrument that made the request. 
    """
    # make query to recieve the id of the requested object
    instrument = Instrument.query.filter_by(instrumentName=instrument_name).first()

    # if no result, define a new object
    if instrument == None:
        new_instrument = Instrument(instrument_name)
        db.session.add(new_instrument)
        db.session.commit()
        instrument = (
        Instrument.query.filter_by(instrumentName=instrument_name).first()
        )

    return instrument.instrumentId

@sio.on("update_status")
def update_status(instrument_id, update_dict):
    """
    From the instruments, updates that instrument's statuses as they perform
    work. 
    
    Parameters:
        instrument_id : int """
    for key, value in update_dict.items():
        status = Status.query.filter_by(instrumentID=instrument_id, statusName=key).first()

        if status == None:
            status = Status(instrumentID=instrument_id, statusName=key, statusValue=value)
            db.session.add(status)
        else:
            status.statusValue = value

    db.session.commit()

    sio.emit("frontend_update_status", update_dict)

    if update_dict.get("obs_id") is not None:
        log_status: dict = {update_dict["obs_id"]: {"progress": "In Progress"}}
        sio.emit("updateObservations", json.dumps(log_status))


@sio.on("observation_complete")
def update_request_form():
    """
    On completion of an observation, this emit allows for more observations
    to be made. 
    """
    sio.emit("enable_request_form")
