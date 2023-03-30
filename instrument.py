from abc import ABCMeta, abstractmethod
import socketio

"""

Note: do not forget to refister new classes with the decorator: @Instrument.register
      else, the instrument will fail to instantiate
"""
value = "Dummy value"
class Instrument(metaclass=ABCMeta):

    status_dictionary = {

        "status_name1": {"value": value, "color": value},
        "status_name2": {"value": value, "color": value}
    }
    sio = socketio.Client()

    def __init__(self):
        self.sio.connect( "http://0.0.0.0:5000" )
        self.name = self.get_instrument_name()
        self.id = self.sio.emit( 'get_id', self.name )
        if( self.id is None ):
            self.id = self.init_status_dict()
        self.sio.wait()

    def __del__(self):
        self.sio.disconnect()

    @abstractmethod
    def get_instrument_name(self):
        pass

    @abstractmethod
    def init_status_dict(self):
        default_status_dict = {}
        self.sio.emit( 'init_instrument' (self.name, default_status_dict) )

    @abstractmethod
    def update_status(self, update_dict):
        self.sio.emit( "update_status", (self.id, update_dict) )

    """
    NOTE: below is an example of instantiating an event for sio
    @self.sio.on('name')
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