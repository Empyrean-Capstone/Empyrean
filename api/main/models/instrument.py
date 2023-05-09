from main import db

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

    def __init__( self, instrumentName:str ):
        """
        Initializes the name of the instrument
        """
        try:
            instrumentName = str(instrumentName)
        except:
            raise ValueError('Instrument name must be castable as a string')
        if instrumentName.strip() == "":
            raise ValueError('Empty names or names composed of whitespace \
            are not allowed')
        else:
            self.instrumentName = instrumentName

    def __repr__(self):
        """
        Allows for a printable representation of the given instrument
        """
        if self.instrumentID == None:
            return f'{self.instrumentName} is not yet in a database'

        return 'ID: {}. \n Name: {}'.format( self.instrumentId, self.instrumentName )
