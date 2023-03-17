"""TODO."""

from datetime import datetime, timedelta
import math
import pickle
import os

from astropy.io import fits
import numpy as np

from . import file_writer
from .. import DATA_FILEPATH, db, sio
from ..models.observation import Observation, headers_to_db_cols


@file_writer.route("/")
def index():
    return ""


@sio.on("save_img")
def submit_data(image_path: str, exposure_data: dict):
    """
    Save observation image data to FITS file format.

    Args:
        image_data(dict): image data resulting from requested exposure

    Returns:
        None: writes observation data to a FITS file and the database
    """
    if DATA_FILEPATH is None:
        print("ERR: Path to FITS file directory is unset. Set this env variable before attempting an exposure.")

        # TODO: return error message
        return

    timestr_fmt = "%Y-%m-%dT%X.%f"
    file_date_fmt = "%Y%m%d"

    image = np.load(image_path)
    os.remove(image_path)

    # calculate needed headers
    time_difference = timedelta(weeks=26)
    date_obs: datetime = datetime.strptime(exposure_data["DATE-OBS"], timestr_fmt)
    exposure_data["date_made_open_source"] = (date_obs + time_difference).strftime(timestr_fmt)

    # create specialized FITS file name
    date_obs_file_prefix = datetime.strftime(date_obs, file_date_fmt)
    padded_id = str(exposure_data["OBSID"]).zfill(4)
    fits_path_head = f"{date_obs_file_prefix}.{padded_id}"

    # ensure path to fits directory exists
    fits_dir = os.path.dirname(DATA_FILEPATH)

    if not os.path.exists(fits_dir):
        os.makedirs(fits_dir)

    fits_path = f"{fits_dir}/{fits_path_head}.fits"

    # make fits file - add headers and such
    hdu = fits.PrimaryHDU(image, uint=True)

    hdu = populate_headers(hdu, exposure_data, fits_path_head)

    # write this fits file to disk
    hdu.writeto(fits_path, overwrite=True)

    # At this point, there is a row in the database for
    # this observation, but it is essentially a receipt
    # that indicates an observation is in action. We must
    # update that row with the data gained from the finished
    # observation.
    db_data: dict = headers_to_db_cols(hdu.header, exposure_data)

    cur_observation = Observation.query.filter_by(id=exposure_data["OBSID"]).first()
    cur_observation.set_attrs(db_data)

    db.session.commit()

    # TODO: return success message
    return "Success"


def populate_headers(hdu, exposure_data, filename):
    hdu.header["OBSERVER"] = "Joe Llama"
    hdu.header["OBSID"] = exposure_data["OBSID"]
    hdu.header["OBSTYPE"] = {
        "object": "Object",
        "dark": "Dark",
        "flat": "Flat",
        "thar": "ThAr",
    }[exposure_data["observation_type"]]
    hdu.header["DATE-OBS"] = exposure_data["DATE-OBS"]
    hdu.header["DATE-END"] = exposure_data["DATE-END"]

    if hdu.header["OBSTYPE"] == "Object":
        hdu.header["OBJECT"] = exposure_data["object"]
        hdu.header["RA"] = exposure_data["right_ascension"]
        hdu.header["DEC"] = exposure_data["declination"]
        hdu.header["ALT"] = exposure_data["altitude"]
    else:
        hdu.header["OBJECT"] = None
        hdu.header["RA"] = "+00:00:00.00"
        hdu.header["DEC"] = "00:00:00.00"
        hdu.header["ALT"] = 0

    # airmass
    hdu.header["AIRM"] = 1 / math.cos(float(exposure_data["altitude"]))
    hdu.header["INSTRUME"] = "Shelyak"

    # TODO: from camera, currently unset
    hdu.header["GAMMA"] = 0
    hdu.header["ROWORDER"] = 0

    # TODO: confirm that "Temperature" in ZWO ASI is CCD-TEMP
    hdu.header["CCD-TEMP"] = exposure_data["TEMPERAT"]
    hdu.header["GAIN"] = exposure_data["GAIN"]
    hdu.header["IMAGETYP"] = exposure_data["observation_type"]
    hdu.header["OFFSET"] = exposure_data["OFFSET"]

    # name of file without fits extension
    hdu.header["LOGID"] = filename

    # TODO: DATE-OBS in numerical form: will receive script
    hdu.header["MJDOBS"] = 0

    hdu.header["EXPTIME"] = exposure_data["exposure_duration"]

    return hdu
