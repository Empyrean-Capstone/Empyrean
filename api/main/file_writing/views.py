from flask import jsonify, request
from . import file_writer

@file_writer.route('/')
def index():
    return ""


# 
@file_writer.route('/submit-data', methods=['POST'])
def get():

    return ""

