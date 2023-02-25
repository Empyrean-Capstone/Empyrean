from main import db

import datetime

class Observation(db.Model):
    id = db.Column( db.Integer, primary_key = True )
    owner_id = db.Column( db.Integer )
    filename = db.Column( db.String )
    date_made_open_source = db.Column( db.DateTime, default=datetime.datetime.utcnow )
    exp_time = db.Column( db.Integer )
    ccd_temp = db.Column( db.Float )
    image_typ = db.Column( db.String )
    gain = db.Column( db.Float )
    offset = db.Column( db.Float )
    gamma = db.Column( db.Float )
    date_obs = db.Column( db.DateTime, default=datetime.datetime.utcnow )
    instrume = db.Column( db.String )
    reworder = db.Column( db.String )
    object_name = db.Column( 'object', db.String )
    obs_type = db.Column( db.String )
    airm = db.Column( db.Float )
    observer = db.Column( db.String )
    obs_id = db.Column( db.String )
    log_id = db.Column( db.String )
    mjdobs = db.Column( db.Float )

    def __init__(self, init_dict):
        self.exp_time = init_dict['exposure_duration']

        self.owner_id = 0
        
        self.ccd_temp = 0.0
        self.gain = 0.0
        self.offset = 0.0
        self.gamma = 0.0
        self.airm = 0.0
        self.mjdobs = 0.0

        self.filename = ""
        self.image_typ = ""
        self.instrume = ""
        self.reworder = ""
        self.obs_type = ""
        self.observer = ""
        self.obs_id = ""
        self.log_id = ""



    def __repr__(self):
        return f'{self.object_name} was observed on {self.date_obs} by {self.observer}'