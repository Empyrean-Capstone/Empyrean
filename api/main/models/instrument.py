from main import db

class Instrument( db.Model ):
    __tablename__ = 'instrument'

    instrumentId = db.Column( db.Integer, primary_key = True )
    instrumentName = db.Column( db.String() )

    def __init__( self, instrumentName ):
        self.instrumentName = instrumentName

    def __repr__(self):
        return 'ID: {}. \n Name: {}'.format( self.instrumentId, self.instrumentName )