from datetime import datetime, timedelta, timezone
from main import db


def headers_to_db_cols(headers, obs_data) -> dict:
    headers = {
        "id": headers["OBSID"],
        "observer": headers["OBSERVER"],
        "obs_type": headers["OBSTYPE"],
        "date_made_open_source": obs_data["date_made_open_source"],
        "exp_time": headers["EXPTIME"],
        "ccd_temp": headers["CCD-TEMP"],
        "image_typ": headers["IMAGETYP"],
        "gain": headers["GAIN"],
        "offset": headers["OFFSET"],
        "date_obs": headers["DATE-OBS"],
        "instrume": headers["INSTRUME"],
        "roworder": headers["ROWORDER"],
        "object_name": headers["OBJECT"],
        "airm": headers["AIRM"],
        "obs_id": headers["OBSID"],
        "log_id": headers["LOGID"],
        "mjdobs": headers["MJDOBS"],

        # TODO: need to determine if we need these and get them
        #  "owner_id" = obs_data[""],
        #  "gamma": headers[""],
    }

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
    object = db.Column(db.String)
    obs_id = db.Column(db.String)
    obs_type = db.Column(db.String)
    observer = db.Column(db.String)
    offset = db.Column(db.Float)
    owner_id = db.Column(db.Integer)
    reworder = db.Column(db.String)

    def __init__(self, init_dict):
        self.set_attrs(init_dict)

    def __repr__(self):
        return f"{self.object} was observed on {self.date_obs} by {self.observer}"

    def __iter__(self):
        return iter([self.id, self.object, "In Progress", str(self.date_obs), "None"])

    def set_attrs(self, attrs: dict):
        for key, val in attrs.items():
            setattr(self, key.lower(), val)
