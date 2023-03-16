from flask import Blueprint

login = Blueprint("login", __name__, url_prefix="/auth_login")

from . import views
