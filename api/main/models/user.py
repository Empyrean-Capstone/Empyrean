from main import db, app


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String())
    name = db.Column(db.String())
    password = db.Column(db.String())
    isadmin = db.Column(db.Boolean)

    def __init__(self, username: str, name: str, password: str, isAdmin: bool):
        self.username = username
        self.name = name
        self.password = password
        self.isadmin = isAdmin
