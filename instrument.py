from abc import ABCMeta, abstractmethod
import socketio
"""

Note: do not forget to refister new classes with the decorator: @Instrument.register
      else, the instrument will fail to instantiate
"""
value = "Dummy value"
host = "http://0.0.0.0:5000"
class Instrument(metaclass=ABCMeta):

    # should be set to default values
    status_dictionary = {

        "status_name1": {"value": value, "color": value},
        "status_name2": {"value": value, "color": value}
    }
    sio = socketio.Client(request_timeout=60,
        logger=True,
        engineio_logger=True,)

    def __init__(self):
        self.sio.connect( host )
        self.name = self.get_instrument_name()
        print( self.name )
        self.id = self.sio.call( 'get_instrument_id', self.name )
        self.update_status( self.status_dictionary )
        print( self.id )
        self.callbacks()
        self.sio.wait()

    def __del__(self):
        self.sio.disconnect()

    @abstractmethod
    def get_instrument_name(self):
        pass

    def update_status(self, update_dict):
        self.sio.emit( "update_status", (self.id, update_dict) )

    @abstractmethod
    def callbacks(self):
        #put all sio endpoints in this function when implemented
        pass

    """
    NOTE: below is an example of instantiating an event for sio
    @Instrument.sio.on('name')
    def name(self):
        pass
    """



"""
Each file should have a main method that runs the this code, plus whatever other code to be implemented
"""
def main():
    instrument = Instrument()

if __name__ == "__main__":
    main()