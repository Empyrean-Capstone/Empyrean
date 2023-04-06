from main import db
from datetime import datetime

class Logsheet(db.Model):
    """
    The python object representation of the Logsheet table of the database
    
    Attributes: 
    -----------
        id : int
            The identifier for the logsheet
        date_created : datetime
            The date this logsheet was created
        starting_id : int   
            The id of the first observation in the logsheet
        date_number : str
            The number representing which logsheet this logsheet is of the 
            given day. 
    """
    
    id = db.Column( db.Integer, primary_key = True )
    date_created = db.Column( db.DateTime, default=datetime.utcnow )
    starting_id = db.Column( db.Integer )
    date_number = db.Column( db.String )

    def __init__(self) -> None:
        """
        Initializes the object
        """
        
        super().__init__()
