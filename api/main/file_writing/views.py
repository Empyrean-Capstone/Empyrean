"""TODO."""

from datetime import datetime, timedelta, timezone
import os
from astropy.io import fits
from . import file_writer
from .. import DATA_FILEPATH, db, sio
from ..models.observation import Observation, headers_to_db_cols


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

        # TODO: return error message
        return

    timestr_fmt = "%Y-%m-%d %X:%f"

    image = image_data["image"]
    exposure_data = image_data["exposure_data"]

    # calculate needed headers
    time_difference = timedelta(weeks=26)
    cur_date = datetime.now(timezone.utc)
    filename_prefix = f"{cur_date}_{exposure_data['OBSID']}.fits"
    exposure_data["date_obs"] = cur_date.strftime(timestr_fmt)
    exposure_data["date_made_open_source"] = (cur_date + time_difference).strftime(timestr_fmt)

    fits_dir = os.path.dirname(DATA_FILEPATH)

    if not os.path.exists(fits_dir):
        os.makedirs(fits_dir)

    fits_path = f"{fits_dir}/{filename_prefix}"

    # make fits file - add headers and such
    hdu = fits.PrimaryHDU(image)

    # airmass: will compute; 1/cos(altitude)
    # can use astropy.units, "45*units.deg.to(u.rad)"
    # NOTE: make sure that altitude in radians, NOT DEGREES
    hdu.header["AIRM"] = 0

    # from camera
    hdu.header["CCD-TEMP"] = 0
    hdu.header["GAIN"] = 0
    hdu.header["GAMMA"] = 0

    # selected at user interface, e.g. dark, flat
    hdu.header["IMAGETYP"] = 0

    # Shelyak
    hdu.header["INSTRUME"] = 0

    # name of file without fits extension
    hdu.header["LOGID"] = 0

    # DATE-OBS in numerical form: will receive script
    hdu.header["MJDOBS"] = 0

    # potentially camera
    hdu.header["OFFSET"] = 0

    # camera
    hdu.header["ROWORDER"] = 0


    hdu.header["OBSERVER"] = "Joe Llama"
    hdu.header["OBSID"] = exposure_data["OBSID"]
    hdu.header["OBSTYPE"] = {
        "object": "Object",
        "dark": "Dark",
        "flat": "Flat",
        "thar": "ThAr",
    }[exposure_data["observation_type"]]

    if hdu.header["OBSTYPE"] == "Object":
        hdu.header["OBJECT"] = exposure_data["object"]
        hdu.header["RA"] = exposure_data["right_ascension"]
        hdu.header["DEC"] = exposure_data["declination"]
        hdu.header["ALT"] = exposure_data["altitude"]
    else:
        hdu.header["RA"] = "+00:00:00.00"
        hdu.header["DEC"] = "00:00:00.00"
        hdu.header["ALT"] = 0

    # write this fits file to disk
    hdu.writeto(fits_path)

    # At this point, there is a row in the database for
    # this observation, but it is essentially a receipt
    # that indicates an observation is in action. We must
    # update that row with the data gained from the finished
    # observation.
    db_data: dict = headers_to_db_cols(hdu.header)

    cur_observation = Observation.query.filter_by(id=exposure_data["OBSID"]).first()
    cur_observation.set_attrs(db_data)

    db.session.commit()

    # TODO: return success message
    return {}
