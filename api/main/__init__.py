from flask import Flask
import os
from file_writing import file_writer
from flask_sqlalchemy import SQLAlchemy

basedir = os.getcwd()

app = Flask( __name__ )
db = SQLAlchemy( app )


# config helpers
def get_env_variable( name ):
    try:
        return os.environ.get(name)
    except KeyError:
        message = "Expected env variable '{}' not set.".format( name )
        raise Exception( message )

# Set variables
POSTGRES_URL = get_env_variable("POSTGRES_URL")
POSTGRES_USER = get_env_variable("POSTGRES_USER")
POSTGRES_PW = get_env_variable("POSTGRES_PW")
POSTGRES_DB = get_env_variable("POSTGRES_DB")
DATA_FILEPATH = get_env_variable("DATA_FILEPATH")

import main.views as views
#app.register_blueprint( example_blueprint, url_prefix="/buyer" )
app.register_blueprint( file_writer, url_prefix="/file-writer" )