"""TODO."""


from datetime import datetime

from main import db


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

    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    starting_id = db.Column(db.Integer)
    date_number = db.Column(db.String)

    def __init__(self) -> None:
        """
        Initializes the object
        """

    def set_attrs(self, attrs: dict):
        """
        Sets the attributes of the object. Can be used to update or initialize
        the object.

        Parameters:
        -----------
            attrs : dict
                Of all of the attributes to be upgraded
        """

        for key, val in attrs.items():
            key = str(key).lower()
            setattr(self, key, val)
