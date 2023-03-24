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

    @abstractmethod
    def get_instrument_name(self):
        pass

    @abstractmethod
    def set_id(self, id):
        self.id = id

    @abstractmethod
    def update_status():
        pass

    @abstractmethod
    def init_status_dict():
        pass


"""
Each file should have a main method that runs the this code, plus whatever other code to be implemented
"""
def main():
    sio = socketio.Client()
    sio.connect("http://0.0.0.0:8081")
    instrument = Instrument()
  
    @sio.on('begin_exposure')
    def sequence(data):
        pass
    
    @sio.on('update')
    def capture_variables(data):
        pass

if __name__ == "__main__":
    main()