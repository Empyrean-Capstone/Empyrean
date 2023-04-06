"""TODO."""

import socketio
import sys
import tempfile
import time
from instrument import Instrument

from astropy.time import Time
from tqdm.auto import trange
import numpy as np

# source and docs: https://github.com/python-zwoasi/python-zwoasi
import zwoasi as asi


class Camera:
    """FIXME: This is an incomplete class to create a simulation
    of the features found in the ZWOCamera class"""

    def __init__(self, device="/dev/cu.", socketio=None, simulator=False):
        """TODO."""
        self.sio = socketio
        if simulator:
            self.simulation = True
            self.device = None  # Replace with instance of K8056
        else:
            self.simulation = False
            self.device = Zwocamera()
        self.id = self.sio.emit("get_id", "camera")

    # Does Nothing
    def expose(self, request_input):
        """
        TODO.

        Args:
            nexp ():
            itime ():
        """
        if self.simulation:
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

                    self.emit_status(data)

                    time.sleep(1)

                if continue_obs == False:
                    break

            self.emit_status({"camera": "Idle"})
            self.sio.emit("set_obs_type", 0)

            data = {
                "obs_id": request_input["OBSID"],
                "itime_elapsed": 0,
                "exp_number": 0,
                "itime_total": 1,
                "nexp_total": 1,
            }

            self.emit_status(data)

            # return type of exposure will be a one dim array from numpy.frombuffer()
            return []

    def return_image_data(self, image, request_input):
        self.sio.emit("save_img", {"image": image, "exposure_data": request_input})

    def sequence(self, request_input):
        """
        TODO.

        Args:
            data ():
        """
        data: dict = {}

        num_exposures = int(request_input["num_exposures"])

        for kk in trange(int(num_exposures)):
            data = {
                "obs_id": request_input["OBSID"],
                "exp_number": int(kk),
                "nexp_total": int(num_exposures),
            }

            self.emit_status(data)

            tstart = Time.now()
            image = self.expose(request_input)
            tend = Time.now()

            time.sleep(1)
            self.return_image_data(image, request_input)
            time.sleep(1)

        self.sio.emit("set_obs_type", 0)
        self.emit_status({"camera": "Finished"})

    def emit_status(self, status: dict) -> None:
        self.sio.emit("update_status", data=(self.id, status))


class Zwocamera(Instrument.register):
    """
    A class that interfaces between a physical camera and the coordination
    backend

    Attributes:
    -----------
        camera: zwoasi.Camera
            The encapsulated class which connects directly to a physical camera
        camera_info : str
            The properties of the connected camera
        status_dictionary: dict
            The default values of the camera to be sent to the database
            Also keeps the current value as work is done. 

    Methods:
    --------
        get_instrument_name()
            Provides the Instrument superclass with the name of the camera
        callbacks()
            Instantiates the socket interface with the callbacks that the
            camera will be listening for.
        sequence( request_instructions, exposure_ids )
            Is the main function called after a request for exposures is made.
            Takes a list of requested exposures, and the instructions specific
            to those exposures, and loops through them to take and exposure
        exposure( exptime=30 )
            uses the camera attribute to take exposures of the given timeframe
    """

    # Default values for the camera 
    status_dictionary = {
                "exp_number": "N/A",
                "itime_elapsed": "N/A",
                "nexp_total": "N/A",
                "camera": "Idle",
                "obs_id": "N/A"
            }

    def __init__(self, device="ZWO ASI2600MM Pro"):
        """
        Parameters
        ----------
        device : str
            The name of the device to be connected
        """

        # TODO: remove
        env_filename = "../ASI_linux_mac_SDK_V1.28/lib/x64/libASICamera2.so.1.27"
        #  env_filename = "/Users/joellama/ASI_linux_mac_SDK_V1.28/lib/mac/libASICamera2.dylib"

        asi.init(env_filename)

        num_cameras = asi.get_num_cameras()

        if num_cameras == 0:
            print("No cameras found")
            sys.exit(0)

        cameras_found = asi.list_cameras()  # Models names of the connected cameras

        if num_cameras == 1:
            print("Found one camera: %s" % cameras_found[0])

        # In list of cameras, find index of given device
        try:
            idx = cameras_found.index(device)
        except ValueError:
            print(f"ERR: Couldn't find specified camera '{device}' in list of connected cameras. Exiting...")
            sys.exit(0)

        self.camera = asi.Camera(idx)
        self.camera_info = self.camera.get_camera_property()
        self.exposure_terminated = False

        self.camera.set_control_value(asi.ASI_BANDWIDTHOVERLOAD, self.camera.get_controls()["BandWidth"]["MinValue"])
        self.camera.disable_dark_subtract()
        super().__init__()

    def get_instrument_name(self):
        """ Returns the name of the camera currently connected
        
        TODO: Make programatic
        """
        
        return "ZWO ASI2600MM Pro"

    def callbacks(self):
        """
        Contains all of the endpoints that the camera will listend to
        in order to take actions 
        """
        
        @Instrument.sio.on("begin_exposure")
        def sequence(obs_instructions, pending_obs):
            self.sequence(obs_instructions, pending_obs)

        @Instrument.sio.event
        def disconnect():
            self.complete()

        @Instrument.sio.on("end_exposure")
        def end_exposure():
            self.exposure_terminated = True

            try:
                self.camera.stop_exposure()
            except:
                pass
            
    # Helper Methods (private, internal usage only)
    @staticmethod
    def __convert_camera_status(status):
        # Basic switch to convert int to status for the backend

        if status == 0:
            return "Idle"
        elif status == 1:
            return "Busy"
        elif status == 2:
            return "Finished"
        else:
            return "Unknown"


    def __get_camera_status_str(self) -> str:
        # gets the current status of the camera based on if the camera is working
        status = self.camera.get_exposure_status()
        return self.__convert_camera_status(status)

    # Public Methods
    def sequence(self, request_instructions: dict, exposure_ids: list[int]):
        """
        When requested by the backend, makes the requested number and 
        type of exposures. 
        
        Parameters
        ----------
        request_instructions: dict
            The instructions for the request, containing the number of exposures,
            the time of exposures, and information required for generating fits
            files after completion like the object type
        exposure_ids: list[int]
            The database ids of the exposures made. Currently stubs of 
            observations, this list is passed back to the backend once 
            the exposures are made
        """
        
        self.camera.exposure_terminated = False

        num_exposures = int(request_instructions["num_exposures"])
        exposure_duration = int(request_instructions["exposure_duration"])

        # updates frontend status
        self.update_status({"nexp_total": num_exposures, "itime_total": exposure_duration})

        kk: int = 0
        cur_exp_data: dict = {}
        # For each exposure id, take an exposure, while the request is active
        # Note: Requests can be stopped at any time by the frontend
        while kk < len(exposure_ids) and not self.exposure_terminated:
            cur_id: int = exposure_ids[kk]

            self.update_status({"obs_id": cur_id, "exp_number": kk})

            tstart = Time.now()
            image = self.expose(exptime=exposure_duration)
            tend = Time.now()

            if not self.exposure_terminated:
                # Set feilds to be used for the fits file
                cur_exp_data["OBSID"] = cur_id
                cur_exp_data["DATE-END"] = tend.fits
                cur_exp_data["DATE-OBS"] = tstart.fits
                cur_exp_data["EXPTIME"] = exposure_duration

                for k, v in self.camera.get_control_values().items():
                    cur_exp_data[k.upper()[:8]] = v

                # make and save file
                tmp = tempfile.NamedTemporaryFile(delete=False, mode="w", prefix="empyrean", suffix=".npy")
                np.save(tmp.name, image)

                # send file
                Instrument.sio.emit("save_img", data=(tmp.name, cur_exp_data, request_instructions))

                cur_exp_data.clear()
                kk += 1


        self.exposure_terminated = False

        # reset values to their original value in the database
        self.update_status(
            {
                "exp_number": 0,
                "itime_elapsed": 0,
                "nexp_total": 0,
            }
        )

        self.complete()

    def expose(self, exptime=30):
        """
        Takes a single exposure for the camera
        
        Parameters
        ----------
            exptime : int
                The amount of time to expose
        """
        
        # set values for the physical camera, including how long to expose for
        self.camera.set_control_value(asi.ASI_EXPOSURE, int(exptime * 1e-6))
        self.camera.set_control_value(asi.ASI_GAIN, 46)
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

        # ensure that the camera is not exposing before continuing
        while self.camera.get_exposure_status() == asi.ASI_EXP_WORKING:
            # make sure we actually are not already exposing
            time.sleep(poll)

        self.camera.start_exposure()

        if initial_sleep:
            time.sleep(initial_sleep)

        status = self.camera.get_exposure_status()

        while status == asi.ASI_EXP_WORKING:
            status = self.camera.get_exposure_status()

        self.update_status({"camera": self.__convert_camera_status(status), "itime_elapsed": 0})

        buffer_ = None
        data = self.camera.get_data_after_exposure(buffer_)

        self.update_status({"camera": self.__get_camera_status_str()})

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

        self.update_status({"camera": self.__get_camera_status_str()})

        return img

    def complete(self):
        """Let the backend know that the camera has completed its exposures"""
        Instrument.sio.emit("exposure_complete")

def main():
    camera = Zwocamera(device="ZWO ASI120MM-S")

if __name__ == "__main__":
    main()

    
