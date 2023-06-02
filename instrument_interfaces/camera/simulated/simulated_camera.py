"""TODO."""


import tempfile
import time

from astropy.time import Time
import numpy as np

from instrument_interfaces.instrument import Instrument


class SimulatedCamera(Instrument):
    """
    TODO.

    Attributes:
        camera:
        name:
        exposure_terminated:
        exposure_terminated:
        exposure_terminated:
    """
    status_dictionary = {
        "Camera": {"value": "Idle", "color": "success"},
        "Current Exposure": {"value": "N/A", "color": "primary"},
        "Exposure Duration": {"value": "N/A", "color": "primary"},
        "Observation ID": {"value": "N/A", "color": "primary"},
    }

    def __init__(self):
        self.camera = None
        self.name = "Simulated Camera"
        self.exposure_terminated = False
        super().__init__()

    def expose(self, request_input):
        """
        TODO.

        Args:
            nexp ():
            itime ():
        """
        poll = 0.2
        initial_sleep = 1

        if initial_sleep:
            time.sleep(initial_sleep)

        self.update_status({"Camera": {"value": "Busy", "color": "warning"}})

        exptime: str = request_input["exposure_duration"]
        exptime_flt: float = float(exptime)

        start_time = time.time()
        time_elapsed: float = 0

        while time_elapsed < exptime_flt and not self.exposure_terminated:
            time_elapsed = time.time() - start_time
            time_elapsed_str = str(int(time_elapsed))
            self.update_status(Instrument.make_num_status({"Exposure Duration": f"{time_elapsed_str} / {exptime}"}))
            time.sleep(poll)

        self.update_status({"Camera": {"value": "Finished", "color": "primary"}})
        self.update_status({"Camera": {"value": "Idle", "color": "success"}})

        return []

    def sequence(self, request_instructions: dict, exposure_ids: list[int]):
        """
        TODO.

        Args:
            data ():
        """
        self.exposure_terminated = False

        ttl_num_exposures = int(request_instructions["num_exposures"])
        exposure_duration = int(request_instructions["exposure_duration"])

        self.update_status(Instrument.make_num_status({"Current Exposure": f"0 / {ttl_num_exposures}"}))

        cur_exp_ind: int = 0
        cur_exp_data: dict = {}

        # For each exposure id, take an exposure, while the request is active
        # Note: Requests can be stopped at any time by the frontend
        while cur_exp_ind < len(exposure_ids) and not self.exposure_terminated:
            cur_id: int = exposure_ids[cur_exp_ind]

            self.update_status(
                {
                    "Camera": {"value": "Busy", "color": "warning"},
                    **Instrument.make_num_status(
                        {
                            "Current Exposure": f"{cur_exp_ind + 1} / {ttl_num_exposures}",
                            "Observation ID": cur_id,
                        }
                    ),
                }
            )

            tstart = Time.now()
            image = self.expose(request_instructions)
            tend = Time.now()

            if not self.exposure_terminated:
                # Set fields to be used for the fits file
                cur_exp_data["OBSID"] = cur_id
                cur_exp_data["DATE-END"] = tend.fits
                cur_exp_data["DATE-OBS"] = tstart.fits
                cur_exp_data["EXPTIME"] = exposure_duration
                cur_exp_data["GAIN"] = "0"
                cur_exp_data["OFFSET"] = "0"
                cur_exp_data["INSTRUME"] = "0"
                cur_exp_data["OBJECT"] = "0"
                cur_exp_data["AIRM"] = "0"

                # make and save file
                tmp = tempfile.NamedTemporaryFile(delete=False, mode="w", prefix="empyrean", suffix=".npy")
                np.save(tmp.name, image)

                # send file
                Instrument.sio.emit("save_img", data=(tmp.name, cur_exp_data, request_instructions))

                cur_exp_data.clear()
                cur_exp_ind += 1

        self.exposure_terminated = False

        # reset values to their original value in the database
        self.update_status(self.status_dictionary)

        self.complete()

    def emit_status(self, status: dict) -> None:
        self.sio.emit("update_status", data=(self.id, status))

    def complete(self):
        """Let the backend know that the camera has completed its exposures."""
        self.sio.emit("exposure_complete")

    def get_instrument_name(self):
        """Return the name of the camera currently connected."""
        return self.name

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


def main():
    camera = SimulatedCamera()


if __name__ == "__main__":
    main()
