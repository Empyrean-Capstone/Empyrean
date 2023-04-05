"""TODO."""

import json
from flask import request

from main import db
from . import users
from .. import sio
from ..models.user import User


@users.get("/")
def register_new_user():
    """
    Register a new user using their username and password.

    Returns:
        201: Registration was successful and a new
             user was created.
    """
    empty_row: dict = {"name": "", "username": "", "password": "", "isadmin": False}

    user_obj = User(empty_row)

    db.session.add(user_obj)
    db.session.commit()

    new_row: list = user_obj.get_creds()

    return new_row, 201


@users.post("/update/")
def update_user():
    updated_user_req: dict = request.get_json()

    req_id = updated_user_req.get("id")

    try:
        cur_user = User.query.filter_by(id=req_id).first()

    except (AttributeError, TypeError):
        return "not found", 404

    else:
        cur_user.set_attrs(updated_user_req)

        db.session.add(cur_user)
        db.session.commit()

        get_all_users()

        return "success", 200


@users.post("/delete/")
def delete_user():
    delete_req: dict = request.get_json()

    row_id = delete_req["id"]

    try:
        cur_user = User.query.filter_by(id=row_id).first()

    except (AttributeError, TypeError):
        return "not found", 404

    else:
        db.session.delete(cur_user)
        db.session.commit()

        return "success", 200


# TODO change this to a get request
@sio.on("retrieveUsers")
def get_all_users():
    """
    TODO.

    Args:
        data ():
    """
    users_query = User.query.all()

    users: list[list] = [user.get_creds() for user in users_query]

    users_json: str = json.dumps(users)

    sio.emit("setUsers", users_json)
