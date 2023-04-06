"""Endpoints related to resolving celestial targets."""

from flask import request
from . import resolve, utils


@resolve.post("/")
def resolve_target():
    """
    Create a new observation request for a specific user.

    Returns:
    --------
        str:
            URI to newly created observation request.
    """
    
    resolution_input: dict = request.get_json()
    celestial_body: str = resolution_input["object"]

    resolution_input.update(utils.query_for_target(celestial_body))

    return resolution_input
