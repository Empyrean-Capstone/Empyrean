from flask import Flask
import os

basedir = os.getcwd()

app = Flask( __name__ )


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

import main.views as views
#app.register_blueprint( example_blueprint, url_prefix="/buyer" )