from flask import Blueprint

subsystem_communication = Blueprint( 'subsystem_communication', __name__ )

from . import views