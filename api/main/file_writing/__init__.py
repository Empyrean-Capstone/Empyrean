from flask import Blueprint


file_writer = Blueprint("file_writer", __name__, url_prefix="/api/file-writer")

from . import views
