from flask import jsonify, request
from . import file_writer
from main import DATA_FILEPATH, db
from api.main.models.observation import Observation
from api.main.models.users import Users
from astropy.io import fits
import datetime

@file_writer.route('/')
def index():
    return ""

# All requests should be in JSON form
# Params:
# data - the set of images from the spectrograph
# 
@file_writer.route('/submit-data', methods=['POST'])
def submit_data():
    # calculate needed headers
    request_data = request.get_json()
    currentDate = datetime.datetime.now()
    filename_const = str( datetime.date.today() ) + request_data['log_id'] + '.fits' 
    time_difference = datetime.timedelta( weeks=26 )
    open_source_date = currentDate + time_difference

    # find owner id
    observer_record = User.query.filter_by( username=request_data['observer'] )
    observer_id = observer_record.id

    # make fits file - add headers and such
    hdu = fits.PrimaryHDU( request_data['data'] )
    hdu.header['SIMPLE'] = True
    hdu.header['BITPIX'] = 16           # change
    hdu.header['NAXIS'] = 2             # number of data axis
    hdu.header['NAXIS1'] = 1600         # length of data axis 1
    hdu.header['NAXIS2'] = 1200         # length of data axis 2
    hdu.header['EXTEND'] = True
    hdu.header['BZERO'] = 32768
    hdu.header['BSCALE'] = 1
    hdu.header['XBINNING'] = 1
    hdu.header['YBINNING'] = request_data['1']
    hdu.header['XPIXSZ'] = 5.20
    hdu.header['YPIXSZ'] = 5.20
    hdu.header['EXPTIME'] = request_data['exp_time']
    hdu.header['CCD-TEMP'] = request_data['ccd_temp']
    hdu.header['IMAGETYP'] = request_data['image_typ']
    hdu.header['GAIN'] = request_data['gain']
    hdu.header['OFFSET'] = request_data['offset']
    hdu.header['GAMMA'] = request_data['gamma']
    hdu.header['DATE-OBS'] = currentDate
    hdu.header['INSTRUME'] = request_data['instrume']
    hdu.header['ROWORDER'] = request_data['roworder']
    hdu.header['OBJECT'] = request_data['object']
    hdu.header['OBSTYPE'] = request_data['obs_type']
    hdu.header['AIRM'] = request_data['airm']
    hdu.header['OBSERVER'] = request_data['observer']
    hdu.header['OBSID'] = observer_id
    hdu.header['LOGID'] = request_data['log_id']
    hdu.header['MJDOBS'] = request_data['mjdobs']

    # write this fits file to disk
    hdu.writeto( DATA_FILEPATH + filename_const )

    # commit this fits file to its log
    new_log = Observation(
        # Calculated values
        date_obs = currentDate,
        date_made_open_source = open_source_date,
        filename = filename_const,
        obs_id = observer_id,

        # values given by the spectrograph server
        exp_time = request_data['exp_time'],
        ccd_temp = request_data['ccd_temp'],
        image_typ = request_data['image_typ'],
        gain = request_data['gain'],
        offset = request_data['offset'],
        gamma = request_data['gamma'],
        instrume = request_data['instrume'],
        reworder = request_data['reworder'],
        object_name = request_data['object_name'],
        obs_type = request_data['obs_type'],
        airm = request_data['airm'],
        observer = request_data['observer'],
        log_id = request_data['log_id'],
        mjdobs = request_data['mjdobs'],
    )
    db.session.add( new_log )
    db.session.commit()
