"""TODO."""


from abc import ABCMeta, abstractmethod
import socketio


VALUE = "Dummy value"
HOST = "http://localhost:5000/"


class Instrument(metaclass=ABCMeta):
    """
    Interface for the standard Instrument to be implemented by other instruments

    Note: do not forget to register new classes with the decorator: @Instrument.register
        else, the instrument will fail to instantiate

    Attributes:
    -----------
        status_dictionary: dict
            Starting values for statuses important for usage.
            Ex: the status of lamps for a spectrograph, whether on or off
        sio: socketio.Client
            Socket connection to be used when communicating with the backend
            server
        id: int
            The unique id given to the instrument upon startup to be used in
            updates.

    Methods:
    --------
        get_instrument_name(): str
            How the instrument acquires its name for identification with the
            server
            Note: Must be implemented in subclasses
        update_status(update_dict): None
            Updates the backend with the given dictionary via the instantiated
            socket connection
        callbacks(): None
            Inside this function is a list of events that the instrument should
            be listening for.
            Note: Must be implemented in subclasses
    """

    # should be set to default values
    status_dictionary = {
        "status_name1": {"value": VALUE, "color": VALUE},
        "status_name2": {"value": VALUE, "color": VALUE},
    }

    sio = socketio.Client(
        request_timeout=60,
        logger=True,
        engineio_logger=True,
    )

    def __init__(self):
        """
        Initializes the socket, id, statuses in the backend, and the callbacks
        that subclasses will implement. The super for this function must
        be called for the normal operation of this instrument.
        """
        self.sio.connect(HOST)
        self.name = self.get_instrument_name()
        self.id = self.sio.call("get_instrument_id", self.name)
        self.update_status(self.status_dictionary)
        self.callbacks()
        self.sio.wait()

    def __del__(self):
        """
        Disconnects the socket if ever the Instrument is de-instantiated
        """

        self.sio.disconnect()

    @abstractmethod
    def get_instrument_name(self):
        """
        Should be a programmatic method of collecting the name of a given
        instrument.
        """

    def update_status(self, update_dict):
        """
        Sends an emmision to the backend with the new statuses of a given
        instrument, using the id as an identifier so that the correct statuses
        are updated.
        Note: The format of these statuses should be the same as the initial
              status dictionary

        Parameters:
        ----------
            update_dict: dict
                the dictionary of updates to the instruments statuses to
                be sent to the backend device
        """

        self.sio.emit("update_status", (self.id, update_dict))

    @staticmethod
    def make_num_status(num_vals: dict):
        """
        Format a dictionary of numerical values to provide the desired color.

        Note: The format of these statuses should be the same as the initial
              status dictionary

        Parameters:
        ----------
            TODO:
        """
        out_vals: dict = {}

        for status_name, status_val in num_vals.items():
            out_vals[status_name] = {"value": status_val, "color": "primary"}

        return out_vals

    @abstractmethod
    def callbacks(self):
        """
        Initializes the endpoints that the backend might call that this
        instrument will want to listen for. As many of these can be implemented.
        NOTE: Use the documentation for the socketio.Client class for more
              information about how these events are created. However,
              one example is given below.
        NOTE: below is an example of instantiating an event for sio
        @Instrument.sio.on('name')
        def function_name(self):
            pass
        """
        # put all sio endpoints in this function when implemented


def main():
    instrument = Instrument()


if __name__ == "__main__":
    main()
