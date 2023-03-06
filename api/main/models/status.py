from main import db, app
import json

class Status(db.Model):
    __tablename__ = 'status'

    id = db.Column( db.Integer, primary_key = True )
    instrumentID = db.Column( db.Integer )
    statusName = db.Column( db.String() )
    statusValue = db.Column( db.String() )

    def __init__(self, instrumentID, statusName, statusValue):
        self.instrumentID = instrumentID
        self.statusName = statusName
        self.statusValue = statusValue

    def serialize( self ):
        return {"id": self.id,
                "instrumentID": self.instrumentID,
                "statusName": self.statusName,
                "statusValue": self.statusValue }

    