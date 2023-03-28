"""TODO."""

from main import db
from .. import sio
from . import status
from ..models import Status, Instrument


SPECTROGRAPH_STATUS = {"Mirror": 0, "LED": 1, "ThAr": 2, "Tungsten": 3}


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

    # if no result, define a new object, with it's statuses
    if instrument == None:
        return define_status(instrument_name)

    return instrument.instrumentId


@sio.on("spectrograph_made_change")
def change_spctrograph_mode(mode, id):
    # update each of their statuses
    for key, value in mode.items():
        update = Status.query.filter_by(instrumentID=id, statusName=SPECTROGRAPH_STATUS[key])
        update.statusValue = "On" if value == 1 else "Off"

    # commit the changes
    db.session.commit()


@sio.on("update_status")
def update_status(instrument_id, update_dict):
    for key, value in update_dict.items():
        status = Status.query.filter_by(instrumentID=instrument_id, statusName=key).first()

        if status == None:
            status = Status(instrumentID=instrument_id, statusName=key, statusValue=value)
            db.session.add(status)
        else:
            status.statusValue = value

    db.session.commit()

    sio.emit("frontend_update_status", update_dict)


@sio.on("observation_complete")
def update_request_form():
    sio.emit("enable_request_form")


def define_status(instrument_name):
    """
    Defines the camera Instrument,
    then gives statuses based on type,
    Then saves this information to the database
    """
    new_camera = Instrument(instrument_name)
    db.session.add(new_camera)
    db.session.commit()

    instrument_id = (
        Instrument.query.filter_by(instrumentName=instrument_name).first().instrumentId
    )  # finds the newly created object, and gathers its id

    new_db_objects = []
    match instrument_name:
        case ("camera", "ZWO ASI120MM-S"):
            new_db_objects.append(Status(instrumentID=instrument_id, statusName="Camera", statusValue="Idle"))
            new_db_objects.append(Status(instrumentID=instrument_id, statusName="currentExposure", statusValue="0"))
            new_db_objects.append(Status(instrumentID=instrument_id, statusName="remainingExposure", statusValue="0"))
        case "spectrograph":
            new_db_objects.append(Status(instrument_id, "Mirror", "Off"))
            new_db_objects.append(Status(instrument_id, "LED", "Off"))
            new_db_objects.append(Status(instrument_id, "ThAr", "Off"))
            new_db_objects.append(Status(instrument_id, "Tungsten", "Off"))
    for status in new_db_objects:
        db.session.add(status)
    db.session.commit()
    return instrument_id
