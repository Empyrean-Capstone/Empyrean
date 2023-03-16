import os
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv


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
POSTGRES_URL = get_env_variable("POSTGRES_URL")
POSTGRES_USER = get_env_variable("POSTGRES_USER")
POSTGRES_PW = get_env_variable("POSTGRES_PW")
POSTGRES_DB = get_env_variable("POSTGRES_DB")
DATA_FILEPATH = get_env_variable("DATA_FILEPATH")

from .file_writing.views import file_writer
from .login.views import login
from .logsheet.views import logsheet
from .observations.views import observations
from .resolve.views import resolve
from .status.views import status

app.register_blueprint(file_writer, url_prefix="/file-writer")
app.register_blueprint(login)
app.register_blueprint(logsheet)
app.register_blueprint(observations)
app.register_blueprint(resolve)
app.register_blueprint(status)

from . import views
