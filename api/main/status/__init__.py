from flask import Blueprint

status = Blueprint("status", __name__, url_prefix="/api/status")

from . import views