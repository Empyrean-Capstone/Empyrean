from main import db, app
import json

class Status(db.Model):
    """
    The python representation of the Status table of the database 
    
    Attributes:
    -----------
        id : int
            identification number in the database
        instrumentID : int
            Foreign key from the owner instrument
        statusName : str
            Name of the status being kept track of
        statusValue : str
            Value of the status
    """
    
    __tablename__ = 'status'

    id = db.Column( db.Integer, primary_key = True )
    instrumentID = db.Column( db.Integer )
    statusName = db.Column( db.String() )
    statusValue = db.Column( db.String() )

    def __init__(self, instrumentID, statusName, statusValue):
        """
        Sets the value of the status default values
        """
        
        self.instrumentID = instrumentID
        self.statusName = statusName
        self.statusValue = statusValue

    def serialize( self ):
        """
        Returns the status in a way that the frontend can use
        
        Returns: 
        --------
            dict:
                Values of the status to be read by the frontend
        """
        
        return {"id": self.id,
                "instrumentID": self.instrumentID,
                "statusName": self.statusName,
                "statusValue": self.statusValue }

    