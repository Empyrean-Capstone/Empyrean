

from flask import request
from main import db
from .. import sio
from . import status
from ..models import Status, Instrument

@sio.on( 'get_id' )
def get_object_id( object_type ):
    print( "made it here" )
    id = 0

    # make query to recieve the id of the requested object
    instrument = Instrument.query.filter_by( instrumentName = object_type ).first()

    # if no result, define a new object, with it's statuses
    if instrument == None:
        id = define_status( object_type )
    else:
        id = instrument.instrumentId

    # return the id to the object
    return id

"""
Defines the camera Instrument, 
then gives statuses based on type,
Then saves this information to the database
"""
def define_status( object_name ):
    new_camera = Instrument( object_name )
    db.session.add( new_camera )
    db.session.commit()

    instrument_id = Instrument.query.filter_by( instrumentName = object_name ).first().instrumentId # finds the newly created object, and gathers its id 

    new_db_objects = []
    match object_name:
        case "camera":
            new_db_objects.append( Status( instrumentID=instrument_id, statusName="Camera", statusValue="Idle" ) )
            new_db_objects.append( Status( instrumentID=instrument_id, statusName="currentExposure", statusValue="0" ) )
            new_db_objects.append( Status( instrumentID=instrument_id, statusName="remainingExposure", statusValue="0" ) )
        case "spectrograph":
            new_db_objects.append( Status( instrument_id, "Mirror", "Off" ))
            new_db_objects.append( Status( instrument_id, "LED", "Off" ))
            new_db_objects.append( Status( instrument_id, "ThAr", "Off" ))
            new_db_objects.append( Status( instrument_id, "Tungsten", "Off" ))
    for status in new_db_objects:
        db.session.add( status )
    db.session.commit()
    return instrument_id