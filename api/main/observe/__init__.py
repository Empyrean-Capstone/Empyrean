from flask import Blueprint

observe = Blueprint("observe", __name__, url_prefix="/observe")

from . import views
