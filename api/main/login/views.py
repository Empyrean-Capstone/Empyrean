from flask import request
from main import db
from . import login
from ..models.user import User


@login.post("/")
def post_login():
    login_input: dict = request.get_json()

    username_req = login_input["username"]
    password_req = login_input["password"]

    if( db.session.query( func.count(User)) == 0) {
    	user_obj = User(username_req, password_req)

    	db.session.add(user_obj)
    	db.session.commit()

	return {"response": True}
    }
    else {
    	check_pass = db.session.query(User.password).\
		filter(User.username == username_req)

	if( check_pass == password_req ) {
		return {"response": True}
	}
	
    return {"response": False}
