"""Endpoints related to observation requests."""

from flask import request, session

from main import db
from . import observations
from .. import sio
from ..logsheet.views import get_all_log_data
from ..models.observation import Observation, get_logs_json_str
from ..status.views import get_current_obsid
import time


def __init_obs_records(request: dict) -> Observation:
    new_observe = Observation(request)

    db.session.add(new_observe)
    db.session.commit()

    return new_observe


def __init_obs_requests(obs_request: dict) -> list:
    i: int = 0
    obs: Observation
    observations: list[Observation] = []
    ids: list[int] = []

    # For each of the observations requested, make an observation record
    # in the database
    while i < int(obs_request["num_exposures"]):
        obs = __init_obs_records(obs_request)
        observations.append(obs)
        i += 1

    # Let the frontend know that there are new observations for it to be appended
    sio.emit("updateObservations", get_logs_json_str(observations))

    ids = [obs.id for obs in observations]

    return ids


@observations.get("/")
def get_observations():
    """
    Return user's open observation collection to the user.

    Returns:
    --------
        dict:
            dictionary of open observation requests
    """

    return {}


@observations.post("/")
def post_observation():
    """
    Create a new observation request for a specific user.
    Is a two part function with setup_camera

    """

    obs_instructions: dict = request.get_json()

    # Have the spectrograph switch to the correct observation type'
    # TODO: Ensure that the spectrograph has completed
    sio.emit("prepare_observation", data=(obs_instructions["obs_type"], obs_instructions) )

    return {}


@sio.on("spectrograph_changed_ports")
def setup_camera( obs_instructions ):
    """
    Is the second part of the post observation function
    Takes the observation instructions from the spectrograph and sends this data
    to the camera. Also makes observations for the database
    """

    print(obs_instructions)
    exp_ids: list[int] = __init_obs_requests(obs_instructions)

    obs_instructions["userid"] = session.get("userid")
    obs_instructions["name"] = session.get("name")

    # The request data from the frontend will act like
    # instructions for how the camera must populate the
    # observations that it has been given in the second
    # input
    sio.emit("begin_exposure", data=(obs_instructions, exp_ids))

    return {}


@observations.post("/end")
def end_observation():
    """
    If selected on the frontend, this is run, prematurely letting the camera
    know to stop taking exposures. Then, this will delete all of the observations
    that have not been completed.
    """

    sio.emit("end_exposure")

    cur_obsid: int = get_current_obsid()

    Observation.query.filter(Observation.id >= cur_obsid).delete()
    db.session.commit()

    get_all_log_data()
    sio.emit( "set_obs_type", data=("object") )

    return {}


@sio.on("exposure_complete")
def conclude_exposure():
    """
    Allows the frontend to request another observation, and resets the
    spectrograph to its default values to preserve its lamps.
    """

    sio.emit("enable_request_form")
    sio.emit("set_obs_type", data=("object"))
