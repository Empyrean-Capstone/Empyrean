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
    --------
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
    """
        Takes in updates to a user from the frontend and changes that user's 
        attributes in the backend

        Parameters:
        -----------
            updated_user_req : dict
                The updated attributes of the given user
                NOTE: Comes as a JSON request that needs
                      to be parsed
        
        Returns:
        --------
            200:
                If the user was found and successfully updated
            404:
                If the user was not found
    """

    # Get the json dictionary of the updated parts of the user
    updated_user_req: dict = request.get_json()

    req_id = updated_user_req.get("id")

    # If the user does not exist, return early with not found
    try:
        cur_user = User.query.filter_by(id=req_id).first()

    except (AttributeError, TypeError):
        return "not found", 404

    # If no exception, update the attributes of the user, save and return
    else:
        cur_user.set_attrs(updated_user_req)

        db.session.add(cur_user)
        db.session.commit()

        get_all_users()

        return "success", 200


@users.post("/delete/")
def delete_user():
    """
    Delets a user from the database permanently
    
    Args:
    -----
        delete_req : dict
            The attributes of the user to be deleted
            NOTE: Initially a json in request that must be parsed
    
    Returns:
    --------
        200:
            If the user exists and was successfully deleted
        404:
            If the user did not exist
    """
    delete_req: dict = request.get_json()

    row_id = delete_req["id"]

    # If the user does not exist, return 404
    try:
        cur_user = User.query.filter_by(id=row_id).first()

    except (AttributeError, TypeError):
        return "not found", 404

    # If found, delete and save the deletion of the user
    else:
        db.session.delete(cur_user)
        db.session.commit()

        return "success", 200


# TODO change this to a get request
# TODO check to make sure the one requesting is of the Admin role
@sio.on("retrieveUsers")
def get_all_users():
    """
    Returns a list of all of the users in the system.
    Used on the user management page for admins

    Returns:
    --------
        json array
            Query result for all the users in the database.
        Null
            If there are no users
    """

    users_query = User.query.all()

    # Gathers the values from the users in list form, forming a 2d array in sum
    users: list[list] = [user.get_creds() for user in users_query]

    # convert the user list to json
    users_json: str = json.dumps(users)

    sio.emit("setUsers", users_json)
