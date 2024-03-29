"""TODO."""

import json
from flask import session

from . import status
from .. import db, sio
from ..models import Instrument, Observation, Status


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
        instrumentID=cur_camera_id,
        statusName="Observation ID"
    ).first()

    cur_obsid: int = int(cur_camera_status.statusValue)

    return cur_obsid


@status.get("/index")
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
    results = Status.query.all()

    serialized_results: list = [res.serialize() for res in results]

    return sorted(serialized_results, key=lambda k: (k["instrumentID"], k["statusName"]))


@status.get("/is_system_busy")
def get_system_status():
    """TODO."""
    is_batch_owner: bool = False

    system_status_row = Status.query.filter_by(statusName="System").first()
    system_status: str = system_status_row.statusValue

    if system_status == "Busy":
        cur_obsid: int = get_current_obsid()
        cur_obs = Observation.query.filter_by(id=cur_obsid).first()
        is_batch_owner = str(cur_obs.owner_id) == session.get("userid")

    sio.emit("update_request_form", data=(system_status, is_batch_owner))

    return "success", 200


def set_system_status(is_batch_owner: bool):
    system_status = Status.query.filter_by(statusName="System").first()
    sio.emit("update_request_form", data=(system_status.statusValue, is_batch_owner))
    return "success", 200


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
        instrument = Instrument.query.filter_by(instrumentName=instrument_name).first()

    return instrument.instrumentId


@sio.on("update_status")
def update_status(instrument_id: int, update_dict: dict):
    """
    From the instruments, updates that instrument's statuses as they perform
    work.

    Parameters:
    -----------
        instrument_id : int
            The database id of the instrument to update the correct status
        update_dict: dict
            The dictionary of statuses to be updated. Each instrument details
            how these statuses should be formatted.

    """
    status_rows: list = []

    # For each status in the dict, find the status, and update the values for it,
    # Then, save the database changes.
    for status_name, status_entry in update_dict.items():
        status = Status.query.filter_by(instrumentID=instrument_id, statusName=status_name).first()

        status_val = status_entry["value"]
        status_color = status_entry["color"]

        # If the status was not found, create it as a status
        # Primarily used on initialization of statuses for new instruments to
        # the system.
        if status == None:
            status = Status(
                instrumentID=instrument_id,
                statusName=status_name,
                statusValue=status_val,
                color=status_color,
            )
            db.session.add(status)

        else:
            status.statusValue = status_val
            status.color = status_color

        status_rows.append(status.serialize())

    db.session.commit()

    # Let the frontend know that there have been changes to the database.
    sio.emit("frontend_update_status", status_rows)

    obs_id_status = update_dict.get("Observation ID")

    # If the camera has updated which observation it is exposing on, update
    # the frontend that displays which observation is being worked on.
    if obs_id_status is not None:
        cur_id: str = obs_id_status["value"]

        if type(cur_id) is int:
            cur_obs = Observation.query.filter_by(id=cur_id).first()
            cur_obs.set_attrs({"status": "In Progress"})
            db.session.commit()

            log_status: dict = {cur_id: {"progress": "In Progress"}}
            sio.emit("updateObservations", json.dumps(log_status))


@sio.on("observation_complete")
def update_request_form():
    """
    On completion of an observation, this emit allows for more observations
    to be made.
    """
    sio.emit("enable_request_form")
