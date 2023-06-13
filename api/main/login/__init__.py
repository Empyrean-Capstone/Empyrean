from flask import Blueprint


login = Blueprint("login", __name__, url_prefix="/api/auth_login")

from . import views
