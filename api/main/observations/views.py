"""Endpoints related to observation requests."""

from flask import request
from main import db

from . import observations
from ..models import Observation
from .. import sio


def get_newest_observation():
    return Observation.query.order_by(-Observation.id).limit(1).first()


def create_observation_entry(dict_data: dict):
    new_observe = Observation(dict_data)

    db.session.add(new_observe)
    db.session.commit()

    sio.emit("prependNewObservation", [field for field in new_observe])

    return new_observe


@observations.get("/")
def get_observations():
    """
    Return user's open observation collection to the user.

    returns:
        dict: dictionary of open observation requests
    """
    return {}


@observations.post("/")
def post_observation():
    """
    Create a new observation request for a specific user.

    returns:
        str: URI to newly created observation request.
    """
    observation_input: dict = request.get_json()

    cur_observation = create_observation_entry(observation_input)

    # "OBSID" is the key used in the FITS file
    # format, so naming it so here is convenient
    observation_input["OBSID"] = cur_observation.id
    observation_input["date"] = str(cur_observation.date_obs)

    sio.emit("begin_exposure", observation_input)

    # TODO: "A POST request creates a resource. The server
    # assigns a URI for the new resource, and returns
    # that URI to the client." Here, we need to create an
    # order, give it a URI where the final part is the order
    # number, e.g. "/observations/4", then return that. The
    # order number should be the last number in the table of
    # all past orders.
    return {}


@observations.post("/end")
def end_observation():
    sio.emit("end_exposure")

    new_observe = get_newest_observation()
    db.session.delete(new_observe)
    db.session.commit()

    sio.emit("removeNewObservation")

    return {}


@sio.on("exposure_complete")
def update_request_form():
    new_observe = get_newest_observation()

    sio.emit("updateNewObservation", [field for field in new_observe])
    sio.emit("enable_request_form")
