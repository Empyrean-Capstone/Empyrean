from flask import Blueprint

resolve = Blueprint("resolve", __name__, url_prefix="/api/resolve")

from . import views
