from main import db, app


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String())
    name = db.Column(db.String())
    password = db.Column(db.String())
    isadmin = db.Column(db.Boolean)

    def __init__(self, init_data: dict):
        self.set_attrs(init_data)

    def __iter__(self):
        return iter([self.id, self.username, self.name, self.password, self.isadmin])

    def get_creds(self):
        return [item for item in self]

    def set_attrs(self, attrs: dict):
        for key, val in attrs.items():
            setattr(self, key.lower(), val)
