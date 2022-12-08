import os

from datetime import datetime
from flask import Flask
from flask import render_template
from flask import request
from flask import url_for
from flask_cors import CORS
from flask_socketio import SocketIO
# from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
 
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
socketio = SocketIO(app) 
@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path>')

def index(path):
	return render_template('layouts/default.html',
                                content=render_template( 'pages/'+path) )

if __name__== "__main__":
    app.run(host=os.getenv('IP', '0.0.0.0'), 
            port=int(os.getenv('PORT', 80)),
            debug=False)