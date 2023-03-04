"""TODO."""

import os
import socketio
import sys
import time

from astropy.io import fits
from astropy.time import Time
from tqdm.auto import tqdm, trange
from tqdm.auto import trange
import astropy.units as units
import matplotlib.pyplot as plt
import numpy as np

# source and docs: https://github.com/python-zwoasi/python-zwoasi
import zwoasi as asi


class Camera:
    """TODO."""

    def __init__(self, device="/dev/cu.", simulator=False):
        """TODO."""
        if simulator:
            self.simulation = True
            self.device = None  # Replace with instance of K8056
            self.id = "5"
        else:
            self.simulation = False
            self.device = Zwocamera()
            self.id = sio.emit("get_id", "camera")

    def expose(self, request_input):
        """
        TODO.

        Args:
            nexp ():
            itime ():
        """
        if self.simulation:
            global sio
            global continue_obs
            data: dict = {}

            nexp = request_input["num_exposures"]
            itime = request_input["exposure_duration"]

            continue_obs = True

            for kk in trange(int(nexp)):
                for jj in trange(int(itime)):
                    self.emit_status({"camera": "Busy"})

                    data = {
                        "obs_id": request_input["OBSID"],
                        "itime_elapsed": jj,
                        "itime_total": int(itime),
                        "exp_number": int(kk),
                        "nexp_total": int(nexp),
                    }

                    update_global_vars(data)
                    self.emit_status(data)

                    time.sleep(1)

                if continue_obs == False:
                    break

            self.emit_status({"camera": "Idle"})
            sio.emit("set_obs_type", 0)

            data = {
                "obs_id": request_input["OBSID"],
                "itime_elapsed": 0,
                "exp_number": 0,
                "itime_total": 1,
                "nexp_total": 1,
            }

            update_global_vars(data)
            self.emit_status(data)

            # return type of exposure will be a one dim array from numpy.frombuffer()
            return []

    def return_image_data(self, image, request_input, tstart, tend):
        global sio
        global global_data
        sio.emit("get_all_variables")

        request_input["DATE-END"] = tend.fits
        request_input["DATE-OBS"] = tstart.fits
        request_input["EXPTIME"] = global_data["itime_total"]

        sio.emit("save_img", {"image": image, "exposure_data": request_input})

    def sequence(self, request_input):
        """
        TODO.

        Args:
            data ():
        """
        global sio
        global global_data
        data: dict = {}

        num_exposures = int(request_input["num_exposures"])

        for kk in trange(int(num_exposures)):
            data = {
                "obs_id": request_input["OBSID"],
                "exp_number": int(kk),
                "nexp_total": int(num_exposures),
            }

            update_global_vars(data)
            self.emit_status(data)

            tstart = Time.now()
            image = self.expose(request_input)
            tend = Time.now()

            sio.emit("get_next_file")

            time.sleep(1)
            self.return_image_data(image, request_input, tstart, tend)
            time.sleep(1)

        update_global_vars({"ccd_status": 0})
        sio.emit("set_obs_type", 0)

    def emit_status(self, status: dict) -> None:
        sio.emit("update_status", data=(self.id, status))


class Zwocamera:
    """
    TODO.

    Attributes:
        camera:
        camera_info:
    """

    def __init__(self, device="ZWO ASI2600MM Pro"):
        env_filename = "/Users/joellama/ASI_linux_mac_SDK_V1.28/lib/mac/libASICamera2.dylib"
        asi.init(env_filename)

        num_cameras = asi.get_num_cameras()

        if num_cameras == 0:
            print("No cameras found")
            sys.exit(0)

        idx = None

        for jj in range(len(asi.list_cameras())):
            if device in asi.list_cameras()[jj]:
                idx = jj

        if idx is None:
            print("Couldn't find specified camera")
            sys.exit(0)

        self.camera = asi.Camera(idx)
        self.camera_info = self.camera.get_camera_property()
        self.camera.set_control_value(asi.ASI_BANDWIDTHOVERLOAD, self.camera.get_controls()["BandWidth"]["MinValue"])
        self.camera.disable_dark_subtract()

    def get_values(self):
        global sio
        global continue_obs
        global global_data
        values = self.camera.get_control_values()
        update_global_vars({"ccd_status": values})

    def sequence(self, meta):
        global sio
        global global_data
        print(meta)
        nexp = meta["nexp"]
        texp = meta["texp"]
        obs_type = meta["obs_type"]
        for kk in trange(nexp):
            sio.emit(
                "update",
                {"current_exposure": {"obs_id": "20220101.001.1001", "exp_number": int(kk), "nexp_total": int(nexp)}},
            )
            tstart = Time.now()
            data = self.expose(exptime=texp)
            tend = Time.now()
            sio.emit("get_next_file")
            time.sleep(1)
            self.save_image(data, obs_type, tstart, tend)
            # print(f"Saving data to {x['logsheet']['obs_fh']}")
            time.sleep(1)
        update_global_vars({"ccd_status": 0})
        sio.emit("set_obs_type", 0)

    def save_image(self, image, _obstype, tstart, tend):
        global sio
        global global_data
        sio.emit("get_all_variables")
        hdu = fits.PrimaryHDU(image, uint=True)
        hdu.header["OBSID"] = f"{os.path.basename(global_data['logsheet']['obs_fh'].split('.fits')[0])}"
        obstype = {"obj": "Object", "dark": "Dark", "flat": "Flat", "thar": "ThAr"}[_obstype]
        hdu.header["OBSTYPE"] = obstype
        print(f"obs_type: {obstype}")

        hdu.header["EXPTIME"] = global_data["current_exposure"]["itime_total"]

        if "Object" in obstype:
            hdu.header["OBJECT"] = "TARGET NAME"
            hdu.header["RA"] = global_data["target"]["ra"]
            hdu.header["DEC"] = global_data["target"]["dec"]
            hdu.header["ALT"] = global_data["target"]["alt"]
        else:
            hdu.header["RA"] = "+00:00:00.00"
            hdu.header["DEC"] = "00:00:00.00"
            hdu.header["ALT"] = 0

        hdu.header["DATE-OBS"] = tstart.fits
        hdu.header["DATE-END"] = tend.fits

        for k, v in self.camera.get_control_values().items():
            hdu.header[k.upper()[:8]] = v

        if not os.path.exists(os.path.dirname(global_data["logsheet"]["obs_fh"])):
            os.makedirs(os.path.dirname(global_data["logsheet"]["obs_fh"]))

        hdu.writeto(global_data["logsheet"]["obs_fh"], overwrite=True, output_verify="silentfix")

    @staticmethod
    def convert_camera_status(status):
        if status == 0:
            return "Idle"
        elif status == 1:
            return "Busy"
        elif status == 2:
            return "Finished"
        else:
            return "Unknown"

    def expose(self, exptime=30, filename="test.fits"):
        global sio
        global global_data
        self.camera.set_control_value(asi.ASI_EXPOSURE, int(exptime * 1e6))
        self.camera.set_control_value(asi.ASI_GAIN, 150)
        self.camera.set_image_type(asi.ASI_IMG_RAW16)
        poll = 0.2
        initial_sleep = 1
        try:
            # Force any single exposure to be halted
            self.camera.stop_video_capture()
            self.camera.stop_exposure()
            time.sleep(initial_sleep)
        except (KeyboardInterrupt, SystemExit):
            raise
        except:
            pass
        print(f"Camera status: {self.camera.get_exposure_status()}")
        while self.camera.get_exposure_status() == asi.ASI_EXP_WORKING:
            # make sure we actually are not already exposing
            time.sleep(poll)
        self.camera.start_exposure()
        if initial_sleep:
            time.sleep(initial_sleep)
        tstart = Time.now()
        status = self.camera.get_exposure_status()
        print(f"Camera status: {status}")
        while status == asi.ASI_EXP_WORKING:
            tnow = Time.now()
            tdiff = int((tnow - tstart).to(units.s).value)
            sio.emit(
                "update",
                {
                    "camera": self.convert_camera_status(status),
                    "current_exposure": {"itime_elapsed": tdiff, "itime_total": int(exptime)},
                },
            )
            status = self.camera.get_exposure_status()
            print(status)
        update_global_vars({"camera": self.convert_camera_status(status)})
        buffer_ = None
        data = self.camera.get_data_after_exposure(buffer_)
        update_global_vars({"camera": self.convert_camera_status(self.camera.get_exposure_status())})
        whbi = self.camera.get_roi_format()
        shape = [whbi[1], whbi[0]]
        if whbi[3] == asi.ASI_IMG_RAW8 or whbi[3] == asi.ASI_IMG_Y8:
            img = np.frombuffer(data, dtype=np.uint8)
        elif whbi[3] == asi.ASI_IMG_RAW16:
            img = np.frombuffer(data, dtype=np.uint16)
        elif whbi[3] == asi.ASI_IMG_RGB24:
            img = np.frombuffer(data, dtype=np.uint8)
            shape.append(3)
        else:
            raise ValueError("Unsupported image type")
        img = img.reshape(shape)
        update_global_vars({"camera": self.convert_camera_status(self.camera.get_exposure_status())})
        return img


if __name__ == "__main__":
    sio = socketio.Client()
    sio.connect("http://0.0.0.0:5000")
    camera = Camera(simulator=True)

    global_data = {}
    sio.emit("get_all_variables")

    @sio.on("begin_exposure")
    def sequence(data):
        camera.sequence(data)

    @sio.on("update")
    def update_global_vars(data: dict):
        for key in data.keys():
            global_data[key] = data[key]
