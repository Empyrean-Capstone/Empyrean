from flask import Blueprint

logsheet = Blueprint("logsheet", __name__, url_prefix="/api/logsheet")

from . import views
