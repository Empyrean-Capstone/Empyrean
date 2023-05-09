"""TODO."""
import os
import sys

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy


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


# loads .env file into the envrionment correctly.
load_dotenv()

# https://github.com/miguelgrinberg/Flask-SocketIO-Chat
app = Flask(__name__)

cfg_class = __get_env_variable("FLASK_CFG_CLASS")
app.config.from_object("main.app_config." + cfg_class)


# see https://flask.palletsprojects.com/en/2.2.x/quickstart/#sessions
# for making good secret keys
app.config["SECRET_KEY"] = "tk2icrNWnrIfG1pYOCrN6Q"


# init the database
db = SQLAlchemy(app)
from .models import *

migrate = Migrate(app, db)


# Allow requests from our react app
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Create socket server that the instruments and the React server can
# communicate with
sio = SocketIO(
    app,
    cors_allowed_origins="*",
    allow_upgrades=True,
    async_mode="eventlet",
    logger=True,
    max_http_buffer_size=10**20,
    ping_timeout=60,
)


DATA_FILEPATH = app.config["DATA_FILEPATH"]

# Import and then register all blueprints to be connected to the app
# NOTE: It seems like these need to be imported here instead of
#       at the top. It may be useful to research more into this
from .file_writing.views import file_writer
from .login.views import login
from .logsheet.views import logsheet
from .observations.views import observations
from .resolve.views import resolve
from .status.views import status
from .users.views import users

app.register_blueprint(file_writer, url_prefix="/api/file-writer")
app.register_blueprint(login)
app.register_blueprint(logsheet)
app.register_blueprint(observations)
app.register_blueprint(resolve)
app.register_blueprint(status)
app.register_blueprint(users)

# Import the general routes to be connected into the app
from . import views

# Import the models for the tests
from . import models
