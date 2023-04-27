from api.main import db, app


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

    __tablename__ = "status"

    id = db.Column(db.Integer, primary_key=True)
    instrumentID = db.Column(db.Integer, nullable=False)
    statusName = db.Column(db.String(), nullable=False)
    statusValue = db.Column(db.String(), nullable=False)
    color = db.Column(db.String(), nullable=False)

    def __init__(self,
                 instrumentID:int,
                 statusName:str,
                 statusValue:str,
                 color="primary"):
        """Sets the value of the status default values."""
        try:
            instrumentID = int(instrumentID)
        except:
            raise ValueError('instrumentID must be castable as an integer')
        try:
            statusName = str(statusName)
            statusValue =  str(statusValue)
            color = str(color)
        except:
            raise ValueError('statusName, statusValue, and color must be castable as strings')
        if(instrumentID <= 0 or 
           statusName.strip() == "" or 
           statusValue.strip() == "" or 
           color.strip() == ""):
            raise ValueError('instrumentID cannot be less than 0, and no other attribute can be empty or whitespace')
        else:
            self.instrumentID = instrumentID
            self.statusName = statusName
            self.statusValue = statusValue
            self.color = color

    def serialize(self):
        """
        Returns the status in a way that the frontend can use

        Returns:
        --------
            dict:
                Values of the status to be read by the frontend
        """
        return {
            "id": self.id,
            "instrumentID": self.instrumentID,
            "statusName": self.statusName,
            "statusValue": self.statusValue,
            "color": self.color,
        }

    def set_attrs(self, attrs: dict):
        """
        For all of the attributes, sets their value to the default value given

        Parameters:
        -----------
            attrs: dict
                The values to set the user's attributes to
        """

        for key, val in attrs.items():
            setattr(self, key, val)
