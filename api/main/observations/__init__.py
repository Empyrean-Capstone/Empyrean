from flask import Blueprint

observations = Blueprint("observations", __name__, url_prefix="/api/observations")

from . import views
