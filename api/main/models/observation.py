from main import db

class Observation(db.Model):
    id = db.Column( db.Integer, primary_key = True )
    owner_id = db.Column( db.Integer )
    filename = db.Column( db.String )
    date_made_open_source = db.Column( db.DateTime )
    exp_time = db.Column( db.Integer )
    ccd_temp = db.Column( db.Float )
    image_typ = db.Column( db.String )
    gain = db.Column( db.Float )
    offset = db.Column( db.Float )
    gamma = db.Column( db.Float )
    date_obs = db.Column( db.DateTime )
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
        for key, value in init_dict.items():
            setattr( self, key, value )
    
    # TODO the incorrect items are currently being sent back, needs to change
    def __repr__(self):
        return f'{self.id}|{self.object_name}|{self.airm}|{self.date_obs}|{self.mjdobs}'