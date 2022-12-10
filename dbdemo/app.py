from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Isurvived2!@localhost/observations'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = 'secret string'

db = SQLAlchemy(app)

class Observation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    star = db.Column(db.String(80), unique=True, nullable=False)
    location = db.Column(db.String(120), nullable=False)

    def __init__(self, star, location):
        self.star = star
        self.location = location

@app.route('/')
def home():
    return '<a href="/addobservation"><button> Click here </button></a>'


@app.route("/addobservation")
def addobservation():
    return render_template("index.html")


@app.route("/observationadd", methods=['POST'])
def observationadd():
    star = request.form["star"]
    location = request.form["location"]
    entry = Observation(star, location)
    db.session.add(entry)
    db.session.commit()

    return render_template("index.html")

if __name__ == '__main__':
    db.create_all()
    app.run()