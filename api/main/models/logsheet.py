from main import db
from datetime import datetime

class Logsheet(db.Model):
    id = db.Column( db.Integer, primary_key = True )
    date_created = db.Column( db.DateTime, default=datetime.utcnow )
    staring_id = db.Column( db.Integer )
    date_number = db.Column( db.String )

    def __init__(self) -> None:
        super().__init__()