from flask import request
from .. import sio
from . import login


@observations.get("/")
def get_login():
    """
    Return user's open observation collection to the user.

    returns:
        dict: dictionary of open observation requests
    """
    return {}


@observations.post("/")
def post_login():
    """
    Create a new observation request for a specific user.

    returns:
        str: URI to newly created observation request.
    """
    login_input: dict = request.get_json()

    username = login_input["username"]
    password = login_input["password"]

    # TODO: Login Logic
    return {}
