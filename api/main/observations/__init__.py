from flask import Blueprint

observations = Blueprint("observations", __name__, url_prefix="/observations")

from . import views
