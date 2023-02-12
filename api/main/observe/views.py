"""Endpoints related to observation requests."""

from flask import request
from .. import sio
from . import observe


@observe.get("/observations/", methods=["GET", "POST"])
def get_observations():
    """
    Return user's open observation collection to the user.

    returns:
        dict: dictionary of open observation requests
    """
    return {}


@observe.post("/observations/")
def post_observation():
    """
    Create a new observation request for a specific user.

    returns:
        str: URI to newly created observation request.
    """
    observation_input: dict = request.get_json()

    num_exposures = observation_input["num_exposures"]
    exposure_time = observation_input["exposure_duration"]

    sio.emit("begin_exposure", [num_exposures, exposure_time])

    # TODO: "A POST request creates a resource. The server
    # assigns a URI for the new resource, and returns
    # that URI to the client." Here, we need to create an
    # order, give it a URI where the final part is the order
    # number, e.g. "/observations/4", then return that. The
    # order number should be the last number in the table of
    # all past orders.
    return {}
