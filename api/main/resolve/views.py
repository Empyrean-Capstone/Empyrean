"""Endpoints related to resolving celestial targets."""

from flask import request
from .. import sio
from . import resolve, utils


@resolve.post("/")
def resolve_target():
    """
    Create a new observation request for a specific user.

    returns:
        str: URI to newly created observation request.
    """
    resolution_input: dict = request.get_json()
    celestial_body: str = resolution_input["object"]

    utils.resolve_target(celestial_body)

    # sio.emit("begin_exposure", [num_exposures, exposure_time])

    # TODO: "A POST request creates a resource. The server
    # assigns a URI for the new resource, and returns
    # that URI to the client." Here, we need to create an
    # order, give it a URI where the final part is the order
    # number, e.g. "/observations/4", then return that. The
    # order number should be the last number in the table of
    # all past orders.
    return {}
