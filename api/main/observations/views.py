"""Endpoints related to observation requests."""

from flask import request
from main import db
from ..models import Observation
from .. import sio
from . import observations

def create_observation( dict_data: dict ):
    new_observe = Observation( dict_data )

    db.session.add(new_observe)
    db.session.commit()

    new_observe_id = new_observe.id

    dict_data['date'] = str(new_observe.date_obs)

#    sio.emit("new_logsheet", dict_data)

    return new_observe_id

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

    create_observation( observation_input )

    sio.emit("begin_exposure", observation_input)

    # TODO: "A POST request creates a resource. The server
    # assigns a URI for the new resource, and returns
    # that URI to the client." Here, we need to create an
    # order, give it a URI where the final part is the order
    # number, e.g. "/observations/4", then return that. The
    # order number should be the last number in the table of
    # all past orders.
    return {}
