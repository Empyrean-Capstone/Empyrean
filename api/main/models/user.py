from main import db, app

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column( db.Integer, primary_key = True )
    username = db.Column( db.String() )
    password = db.Column( db.String() )

    def __init__(self, username, password):
        self.username = username
        self.password = password