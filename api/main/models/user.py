from main import db, app


ACCESS = {"user": 0, "admin": 1}


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String())
    name = db.Column(db.String())
    password = db.Column(db.String())
    role = db.Column(db.String())

    def __init__(self, username: str, name: str, password: str, role: str):
        self.username = username
        self.name = name
        self.password = password
        self.role = role
