"""
Routes related to user authentication.

http status references:
    1. https://httpwg.org/specs/rfc9110.html#status.codes
    2. https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
"""


from flask import request, session

from . import login
from .. import db
from ..models.user import User


@login.get("/")
def get_user():
    """
    Get the current user's name.

    Returns:
    --------
        str
            The user's name
    """
    id = session.get("userid")

    if id is None:
        return "", 401

    username = session.get("username")
    name = session.get("name")
    isadmin = session.get("isadmin")

    return {"username": username, "name": name, "isadmin": isadmin}, 200


@login.post("/")
def post_login():
    """
    Authenticate the user using their username and password.

    Returns:
    --------
        200
            The user was successfully logged in
        401
            User credentials did not match an existing user
    """
    login_input: dict = request.get_json()
    username_req = login_input["username"]
    password_req = login_input["password"]

    if User.query.count() == 0:
        return "unauthorized", 401

    try:
        cur_user = User.query.filter_by(username=username_req).first()

    except (AttributeError, TypeError):
        return "unauthorized", 401

    else:
        if cur_user is not None and password_req == cur_user.password:
            session["userid"] = str(cur_user.id)
            session["username"] = cur_user.username
            session["name"] = cur_user.name
            session["isadmin"] = cur_user.isadmin

            return "success", 200

        else:
            return "unauthorized", 401


@login.post("/logout/")
def logout():
    """
    Log the user out, ending their user session.

    Returns:
    --------
        200
            The user was successfully logged out
        404
            Endpoint is valid but the requested
            resource could not be found
    """
    userid = session.pop("userid", None)

    if userid is None:
        return "not found", 404

    session.clear()

    return "success", 200


@login.post("/validate/")
def validate_session():
    """
    Check if the user has a valid session.

    Returns:
    --------
        200
            User has a valid session.
        404
            Endpoint is valid but the requested
            resource could not be found
    """
    if session.get("username") is None:
        return "not found", 404

    validation_req = request.get_json()

    needs_admin = validation_req["needs_admin"]

    if needs_admin == "False" or session.get("isadmin"):
        return "success", 200

    return "forbidden", 403
