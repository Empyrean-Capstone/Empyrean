from flask import Blueprint

resolve = Blueprint("resolve", __name__, url_prefix="/resolve")

from . import views
