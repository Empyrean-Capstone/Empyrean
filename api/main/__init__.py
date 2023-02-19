import os
from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# config helpers
def get_env_variable(name: str) -> str | None:
    """
    Return Flask environment vars.

    Args:
        name (str): environment variable to retrieve.

    Returns:
        str or None: environment var or exception
    """
    try:
        return os.environ.get(name)
    except KeyError as exception:
        message = f"Expected env variable '{name}' not set."
        raise Exception(message) from exception

# https://github.com/miguelgrinberg/Flask-SocketIO-Chat
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = get_env_variable("SQLALCHEMY_DATABASE_URI")
db = SQLAlchemy( app )
from .models import * 
migrate = Migrate( app, db )
app.config["SECRET_KEY"] = "secret!"
CORS(app, resources={r"/*": {"origins": "*"}})
sio = SocketIO(app, cors_allowed_origins="*")




# Set variables
POSTGRES_URL = get_env_variable("POSTGRES_URL")
POSTGRES_USER = get_env_variable("POSTGRES_USER")
POSTGRES_PW = get_env_variable("POSTGRES_PW")
POSTGRES_DB = get_env_variable("POSTGRES_DB")

from .observations.views import observations
app.register_blueprint(observations)


from . import views
