

from flask import request, jsonify
from main import db, app
from .. import sio
from . import status
from ..models import Status, Instrument
from enum import Enum

class SpectrographStatus( Enum ):
    Mirror = 0
    LED = 1
    ThAr = 2
    Tungsten = 3

@sio.on( 'get_id' )
def get_object_id( object_type ):

    # make query to recieve the id of the requested object
    instrument = Instrument.query.filter_by( instrumentName = object_type ).first()

    # if no result, define a new object, with it's statuses
    if instrument == None:
        id = define_status( object_type )
    else:
        id = instrument.instrumentId

    # return the id to the object
    return id

@sio.on( 'spectrograph_made_change' )
def change_spctrograph_mode( mode, id ):

    # update each of their statuses
    for key, value in mode.items():
        update = Status.query.filter_by( instrumentID = id, statusName = SpectrographStatus(key).name )
        update.statusValue = "On" if value == 1 else "Off"

    #commit the changes
    db.session.commit()

@status.get('/index')
def index():
    result = Status.query.all()
    for index in range(len( result )): 
        result[ index ] = result[ index ].serialize()
    return result


@sio.on( "update_status" )
def update_status( instrument_id, update_dict ):
    for key, value in update_dict:
        status = Status.query.filter_by( instrumentID=instrument_id, statusName=key).first()
        if status == None:
            status = Status(instrumentID=instrument_id, statusName=key, statusValue=value )
            db.session.add( status )
        else:
            status.status_value = value
    db.session.commit()

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