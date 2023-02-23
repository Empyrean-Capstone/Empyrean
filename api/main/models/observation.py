from main import db


class Observation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer)
    filename = db.Column(db.String)
    date_made_open_source = db.Column(db.DateTime)
    exp_time = db.Column(db.Integer)
    ccd_temp = db.Column(db.Float)
    image_typ = db.Column(db.String)
    gain = db.Column(db.Float)
    offset = db.Column(db.Float)
    gamma = db.Column(db.Float)
    date_obs = db.Column(db.DateTime)
    instrume = db.Column(db.String)
    reworder = db.Column(db.String)
    object_name = db.Column("object", db.String)
    obs_type = db.Column(db.String)
    airm = db.Column(db.Float)
    observer = db.Column(db.String)
    obs_id = db.Column(db.String)
    log_id = db.Column(db.String)
    mjdobs = db.Column(db.Float)

    def __repr__(self):
        return f"{self.object_name} was observed on {self.date_obs} by {self.observer}"
