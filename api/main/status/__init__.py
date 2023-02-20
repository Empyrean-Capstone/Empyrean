from flask import Blueprint

status = Blueprint("status", __name__, url_prefix="/status")

from . import views