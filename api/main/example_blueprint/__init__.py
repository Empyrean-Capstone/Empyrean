from flask import Blueprint

example_blueprint = Blueprint( 'buyer', __name__ )

from . import views