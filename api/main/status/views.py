"""TODO."""

import json

from main import db
from .. import sio
from . import status
from ..models import Status, Instrument

# FIXME: must have a way to designate the current camera
def get_current_camera() -> int:
    return Instrument.query.filter_by(instrumentName="ZWO ASI120MM-S").first().instrumentId


def get_current_obsid() -> int:
    cur_camera_id: int = get_current_camera()

    cur_camera_status = Status.query.filter_by(instrumentID=cur_camera_id, statusName="obs_id").first()

    cur_obsid: int = int(cur_camera_status.statusValue)

    return cur_obsid

@status.get('/index')
def index():
    result = Status.query.all()
    for index in range(len(result)):
        result[index] = result[index].serialize()
    return result

@sio.on("get_instrument_id")
def get_instrument_id(instrument_name):
    # make query to recieve the id of the requested object
    instrument = Instrument.query.filter_by(instrumentName=instrument_name).first()
    print( instrument.instrumentId )

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
    print( update_dict )
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
    sio.emit("enable_request_form")
