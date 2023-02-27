from flask import Blueprint

logsheet = Blueprint("logsheet", __name__, url_prefix="/logsheet")

from . import views
