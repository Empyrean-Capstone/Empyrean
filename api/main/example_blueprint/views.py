from flask import jsonify
from . import example_blueprint
#from models import {Attempted model import}

@example_blueprint.route('/')
def index():
    return ""

@example_blueprint.route('/get')
def get():
    return ""

