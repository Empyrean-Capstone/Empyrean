from flask import request
from main import db
from . import login
from ..models.user import User


@login.post("/")
def post_login():
    """
    Create a new observation request for a specific user.

    returns:
        str: URI to newly created observation request.
    """
    login_input: dict = request.get_json()

    username = login_input["username"]
    password = login_input["password"]

    # TODO:
    # 1. hash in the frontend
    # 2. only create a User object and write to database if creating new user, NOT logging in
    user_obj = User(username, password)

    db.session.add(user_obj)
    db.session.commit()

    return {"response": True}
