"""TODO."""

from datetime import datetime, timedelta
import math
import os

from astropy.io import fits
import numpy as np

from . import file_writer
from .. import DATA_FILEPATH, db, sio
from ..models.observation import Observation, get_logs_json_str


@file_writer.route("/")
def index():
    return ""


@sio.on("save_img")
def submit_data(image_path, exposure_data: dict, request_input: dict):
    """
    Save observation image data to FITS file format.

    Parameters:
    -----------
        image_data : dict
            Image data resulting from requested exposure

    Returns:
    --------
        200
            All operations were successful
        TODO: add error status
    """
    timestr_fmt = "%Y-%m-%dT%X.%f"

    image = __read_image_file(image_path)

    date_obs: datetime = datetime.strptime(exposure_data["DATE-OBS"], timestr_fmt)

    request_input["date_made_open_source"] = (date_obs + timedelta(weeks=26)).strftime(timestr_fmt)
    fits_path_head = __init_filename(date_obs)
    fits_path = __init_fits_abspath(DATA_FILEPATH, fits_path_head)

    hdu = __init_header_data_unit(image, exposure_data, request_input, fits_path_head)

    hdu.writeto(fits_path, overwrite=True)

    # At this point, there is a row in the database for
    # this observation, but it is essentially a receipt
    # that indicates an observation is in action. We must
    # update that row with the data gained from the finished
    # observation.
    __update_db_cols(hdu.header, request_input)

    return "success", 200


def __read_image_file(image_path: str) -> np.ndarray:
    image = np.load(image_path)
    os.unlink(image_path)

    return image


def __init_header_data_unit(image: np.ndarray, exposure_data: dict, request_input: dict, filename: str):
    def enter_request_input(hdu, input: dict):
        hdu.header["OBSERVER"] = input["observer"]

        # TODO: whats the difference between this and IMAGETYP?
        hdu.header["OBSTYPE"] = {
            "object": "Object",
            "dark": "Dark",
            "flat": "Flat",
            "thar": "ThAr",
        }[input["obs_type"]]

        # TODO: confirm that "Temperature" in ZWO ASI is CCD-TEMP
        #  hdu.header["CCD-TEMP"] = exposure_data["TEMPERAT"]
        hdu.header["IMAGETYP"] = input["obs_type"]

        if hdu.header["OBSTYPE"] == "Object":
            hdu.header["OBJECT"] = input["object"]
            hdu.header["RA"] = input["right_ascension"]
            hdu.header["DEC"] = input["declination"]
            hdu.header["ALT"] = input["altitude"]
            hdu.header["AIRM"] = 1 / math.cos(float(input["altitude"]))  # airmass
        else:
            hdu.header["OBJECT"] = "None"
            hdu.header["RA"] = "+00:00:00.00"
            hdu.header["DEC"] = "00:00:00.00"
            hdu.header["ALT"] = 0
            hdu.header["AIRM"] = 0

        return hdu

    def enter_exp_data(hdu, data: dict, filename: str):
        hdu.header.update(data)
        hdu.header["LOGID"] = filename  # name of file without fits extension

        # TODO: from camera, currently unset
        #  hdu.header["GAMMA"] = 0
        #  hdu.header["ROWORDER"] = 0

        return hdu

    hdu = fits.PrimaryHDU(image, uint=True)

    hdu = enter_request_input(hdu, request_input)
    hdu = enter_exp_data(hdu, exposure_data, filename)

    # TODO: get from current instrument
    hdu.header["INSTRUME"] = "Shelyak"

    # TODO: DATE-OBS in numerical form: will receive script
    hdu.header["MJDOBS"] = 0

    return hdu


def __update_db_cols(headers, request_input: dict) -> dict:
    cols = {
        "id": headers["OBSID"],
        "observer": headers["OBSERVER"],
        "obs_type": headers["OBSTYPE"],
        "exp_time": headers["EXPTIME"],
        "image_typ": headers["IMAGETYP"],
        "gain": headers["GAIN"],
        "offset": headers["OFFSET"],
        "date_obs": headers["DATE-OBS"],
        "instrume": headers["INSTRUME"],
        "object_name": headers["OBJECT"],
        "airm": headers["AIRM"],
        "obs_id": headers["OBSID"],
        "log_id": headers["LOGID"],
        "mjdobs": headers["MJDOBS"],
        "filename": f"{headers['LOGID']}.fits",
        "date_made_open_source": request_input["date_made_open_source"],
        "status": "Complete"
        # TODO: need to determine if we need these and get them
        #  "ccd_temp": headers["CCD-TEMP"],
        #  "gamma": headers[""],
        #  "roworder": headers["ROWORDER"],
    }

    cur_obs = Observation.query.filter_by(id=headers["OBSID"]).first()
    cur_obs.set_attrs(cols)
    db.session.commit()

    sio.emit("updateObservations", get_logs_json_str([cur_obs]))

    # TODO: return error if operation fails
    return headers


def __init_filename(date_obs):
    file_date_fmt = "%Y%m%dT%H%M%S"

    return datetime.strftime(date_obs, file_date_fmt)


def __init_fits_abspath(fits_dir: str, fits_file_head: str) -> str:
    # TODO: return errors?
    fits_dir = os.path.abspath(fits_dir)

    if not os.path.exists(fits_dir):
        os.makedirs(fits_dir)

    fits_path = f"{fits_dir}/{fits_file_head}.fits"

    return fits_path
