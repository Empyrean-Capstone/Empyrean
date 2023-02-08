from flask import jsonify, request
from . import file_writer
from main import DATA_FILEPATH, db
from models.log import Log

@file_writer.route('/')
def index():
    return ""


# Params:
# data - the set of images from the spectrograph
# 
@file_writer.route('/submit-data', methods=['POST'])
def submit_data():
    

    
    new_log = Log()
    db.session.add( new_log )
    db.session.commit()
