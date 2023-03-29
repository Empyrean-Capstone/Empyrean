"""TODO."""
import os
import sys

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv


# config helpers
def __get_env_variable(name: str) -> str:
    """
    Return Flask environment vars.

    Args:
        name (str): environment variable to retrieve.

    Returns:
        str: environment var or exception
    """
    key = os.environ.get(name)

    if key is None:
        print(f"Env variable '{name}' not set. Exiting...")
        sys.exit(0)

    return key


# https://github.com/miguelgrinberg/Flask-SocketIO-Chat
app = Flask(__name__)

app.config["SESSION_COOKIE_HTTPONLY"] = False
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True

# loads .env file into the envrionment correctly.
load_dotenv()
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI")
db = SQLAlchemy(app)
from .models import *

migrate = Migrate(app, db)

# see https://flask.palletsprojects.com/en/2.2.x/quickstart/#sessions
# for making good secret keys
app.config["SECRET_KEY"] = "tk2icrNWnrIfG1pYOCrN6Q"

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
sio = SocketIO(
    app,
    cors_allowed_origins="*",
    allow_upgrades=True,
    async_mode="eventlet",
    logger=True,
    max_http_buffer_size=10**20,
    ping_timeout=60,
)

# Set variables from .env to global scope
POSTGRES_URL = __get_env_variable("POSTGRES_URL")
POSTGRES_USER = __get_env_variable("POSTGRES_USER")
POSTGRES_PW = __get_env_variable("POSTGRES_PW")
POSTGRES_DB = __get_env_variable("POSTGRES_DB")
DATA_FILEPATH = __get_env_variable("DATA_FILEPATH")

from .file_writing.views import file_writer
from .login.views import login
from .logsheet.views import logsheet
from .observations.views import observations
from .resolve.views import resolve
from .status.views import status

app.register_blueprint(file_writer, url_prefix="/api/file-writer")
app.register_blueprint(login)
app.register_blueprint(logsheet)
app.register_blueprint(observations)
app.register_blueprint(resolve)
app.register_blueprint(status)

from . import views
