from datetime import datetime, timedelta, timezone
from main import db


def headers_to_db_cols(obs_data) -> dict:
    headers = {
        "id": obs_data["OBSID"],
        "observer": obs_data["OBSERVER"],
        "obs_type": obs_data["OBSTYPE"],
    }

    #  owner_id = obs_data[""]
    #
    #  date_made_open_source = obs_data[""]
    #  exp_time = obs_data[""]
    #  ccd_temp = obs_data[""]
    #  image_typ = obs_data[""]
    #  gain = obs_data[""]
    #  offset = obs_data[""]
    #  gamma = obs_data[""]
    #  date_obs = obs_data[""]
    #  instrume = obs_data[""]
    #  roworder = obs_data["ROWORDER"]
    #  object_name = obs_data[""]

    #  airm = obs_data[""]
    #  obs_id = obs_data[""]
    #  log_id = obs_data[""]
    #  mjdobs = obs_data[""]

    return headers


class Observation(db.Model):
    current_date = datetime.now(timezone.utc)
    open_source_date = current_date + timedelta(weeks=26)

    airm = db.Column(db.Float)
    ccd_temp = db.Column(db.Float)
    date_made_open_source = db.Column(db.DateTime, default=open_source_date)
    date_obs = db.Column(db.DateTime, default=current_date)
    exp_time = db.Column(db.Integer)
    filename = db.Column(db.String)
    gain = db.Column(db.Float)
    gamma = db.Column(db.Float)
    id = db.Column(db.Integer, primary_key=True)
    image_typ = db.Column(db.String)
    instrume = db.Column(db.String)
    log_id = db.Column(db.String)
    mjdobs = db.Column(db.Float)
    object_name = db.Column("object", db.String)
    obs_id = db.Column(db.String)
    obs_type = db.Column(db.String)
    observer = db.Column(db.String)
    offset = db.Column(db.Float)
    owner_id = db.Column(db.Integer)
    reworder = db.Column(db.String)

    def __init__(self, init_dict):
        self.set_attrs(init_dict)

    def __repr__(self):
        return f"{self.object_name} was observed on {self.date_obs} by {self.observer}"

    def set_attrs(self, attrs: dict):
        for key, val in attrs.items():
            setattr(self, key.lower(), val)
