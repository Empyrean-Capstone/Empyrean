from flask import Blueprint

file_writer = Blueprint( 'file_writer', __name__ )

from . import views