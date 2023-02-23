"""TODO."""

import datetime
import os
from astropy.io import fits
from flask import jsonify, request
from . import file_writer
from .. import DATA_FILEPATH, db, sio
from ..models.observation import Observation
from ..models.user import User


@file_writer.route("/")
def index():
    return ""


@sio.on("save_img")
def submit_data(image_data: dict):
    """
    Save observation image data to FITS file format.

    Args:
        image_data(dict): image data resulting from requested exposure

    Returns:
        None: writes observation data to a FITS file and the database
    """
    if DATA_FILEPATH is None:
        print("ERR: Path to FITS file directory is unset. Set this env variable before attempting an exposure.")
        return

    image = image_data["image"]
    exposure_data = image_data["exposure_data"]

    # calculate needed headers
    filename_const = f"{datetime.date.today()}_{exposure_data['OBSID']}.fits"
    time_difference = datetime.timedelta(weeks=26)
    currentDate = datetime.datetime.now()
    open_source_date = currentDate + time_difference

    fits_dir = os.path.dirname(DATA_FILEPATH)

    if not os.path.exists(fits_dir):
        os.makedirs(fits_dir)

    fits_path = f"{fits_dir}/{filename_const}"

    # TODO: requires database access
    #
    # find owner id
    # observer_record = User.query.filter_by(username=request_data["OBSERVER"])
    # observer_id = observer_record.first()

    # make fits file - add headers and such
    hdu = fits.PrimaryHDU(image)

    # assuming the exposure_data from the camera has the correct
    # headers, we can simply update the fits header dict
    hdu.header.update(exposure_data)

    hdu.header["SIMPLE"] = True
    hdu.header["BITPIX"] = 16  # change
    hdu.header["NAXIS"] = 2  # number of data axis
    hdu.header["NAXIS1"] = 1600  # length of data axis 1
    hdu.header["NAXIS2"] = 1200  # length of data axis 2
    hdu.header["EXTEND"] = True
    hdu.header["BZERO"] = 32768
    hdu.header["BSCALE"] = 1
    hdu.header["XBINNING"] = 1
    hdu.header["YBINNING"] = 1
    hdu.header["XPIXSZ"] = 5.20
    hdu.header["YPIXSZ"] = 5.20

    #  hdu.header["AIRM"] = exposure_data["airm"]
    #  hdu.header["CCD-TEMP"] = exposure_data["ccd_temp"]
    #  hdu.header["DATE-OBS"] = currentDate
    #  hdu.header["GAIN"] = exposure_data["gain"]
    #  hdu.header["GAMMA"] = exposure_data["gamma"]
    #  hdu.header["IMAGETYP"] = exposure_data["image_typ"]
    #  hdu.header["INSTRUME"] = exposure_data["instrume"]
    #  hdu.header["LOGID"] = request_data["log_id"]
    #  hdu.header["MJDOBS"] = exposure_data["mjdobs"]
    #  hdu.header["OBJECT"] = exposure_data["object"]
    #  hdu.header["OFFSET"] = exposure_data["offset"]
    #  hdu.header["ROWORDER"] = exposure_data["roworder"]

    #  hdu.header["OBSERVER"] = exposure_data["OBSERVER"]
    #  hdu.header["OBSID"] = exposure_data["OBSID"]
    #  hdu.header["OBSTYPE"] = exposure_data["OBSTYPE"]

    for k, v in hdu.header.items():
        print(f"{k}: {v}")

    # write this fits file to disk
    hdu.writeto(fits_path)

    # commit this fits file to its log
    new_log = Observation(exposure_data)

    print(new_log)

    #  db.session.add(new_log)
    #  db.session.commit()

    # TODO: add success message?
