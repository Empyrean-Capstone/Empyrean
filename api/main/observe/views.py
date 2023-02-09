from flask import jsonify, request
from . import observe


@observe.route("/ping", methods=["POST"])
def print_user_choices():
    data = request.get_json()
    print(data)
    return request.get_json()
