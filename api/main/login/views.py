"""
Routes related to user authentication.

http status references:
    1. https://httpwg.org/specs/rfc9110.html#status.codes
    2. https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
"""


from flask import request, session

from main import db
from . import login
from ..models.user import User


@login.post("/")
def post_login():
    """
    Authenticate the user using their username and password.

    Returns:
        200: The user was successfully logged in
        401: User credentials did not match an existing user
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
        if password_req == cur_user.password:
            session["userid"] = str(cur_user.id)
            session["username"] = cur_user.username

            return "success", 200

        else:
            return "unauthorized", 401


@login.post("/logout/")
def logout():
    """
    Log the user out, ending their user session.

    Returns:
        200: The user was successfully logged out
        404: endpoint is valid but the requested
             resource could not be found
    """
    userid = session.pop("userid", None)

    if userid is None:
        return "not found", 404

    session.clear()

    return "success", 200


@login.post("/register/")
def register_new_user():
    """
    Register a new user using their username and password.

    Returns:
        201: Registration was successful and a new
             user was created.

        409 (Conflict): User, found via username, already
                        exists
    """

    def commit_user():
        user_obj = User(username_req, password_req)

        db.session.add(user_obj)
        db.session.commit()

        return "created", 201

    reg_input: dict = request.get_json()
    username_req = reg_input["username"]
    password_req = reg_input["password"]

    if User.query.count() == 0:
        return commit_user()

    cur_user = User.query.filter_by(username=username_req).first()

    if cur_user is None:
        return commit_user()

    else:
        return "user exists", 409


@login.post("/validate/")
def validate_session():
    """
    Check if the user has a valid session.

    Returns:
        200: user has a valid session.
        404: endpoint is valid but the requested
             resource could not be found
    """
    userid = session.get("userid")

    if userid is None:
        return "not found", 404

    return "success", 200
