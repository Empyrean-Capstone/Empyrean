from main import db
from datetime import datetime, timezone

class Logsheet(db.Model):
    current_date = datetime.now(timezone.utc)

    id = db.Column( db.Integer, primary_key = True )
    date_created = db.Column( db.DateTime, default=current_date )
    starting_id = db.Column( db.Integer, default=0 )
    date_number = db.Column( db.String, default=current_date.strftime("%Y%m%d") )

    def __init__(self, init_dict) -> None:
        super().__init__()

    def __repr__(self):
        return f"Logsheet {self.date_number}"
    
    def __iter__(self):
        return iter([self.id, f"{self.date_number}.{str(self.starting_id).zfill(3)}"])
