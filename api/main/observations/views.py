"""Endpoints related to observation requests."""

from flask import request
from .. import sio
from . import observations


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

    sio.emit("begin_exposure", observation_input)

    # TODO: "A POST request creates a resource. The server
    # assigns a URI for the new resource, and returns
    # that URI to the client." Here, we need to create an
    # order, give it a URI where the final part is the order
    # number, e.g. "/observations/4", then return that. The
    # order number should be the last number in the table of
    # all past orders.
    return {}
