from api.main import db

class Instrument( db.Model ):
    """
    The python object implementation of the Instrument table of the database

    Attributes:
    -----------
        instrumentID : int
            Identifier of the instrument
        instrumentName : str
            The name of the instrument
    """

    __tablename__ = 'instrument'

    instrumentId = db.Column( db.Integer, primary_key = True )
    instrumentName = db.Column( db.String() )

    def __init__( self, instrumentName ):
        """
        Initializes the name of the instrument
        """

        self.instrumentName = instrumentName

    def __repr__(self):
        """
        Allows for a printable representation of the given instrument
        """

        return 'ID: {}. \n Name: {}'.format( self.instrumentId, self.instrumentName )
