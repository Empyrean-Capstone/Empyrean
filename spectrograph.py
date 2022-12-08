from serial import Serial
from time import sleep
import socketio
class K8056(object):
    """
    K8056 - Class for controlling the velleman K8056 8 channel relay card

    K8056(device, repeat=0, wait=0)
    Give serial port as number or device file.
    For better reliability repeat instructions `repeat` times
    and `wait` seconds between execution.
    """
    def __init__(self, device, repeat=0, wait=0):
        self._serial = Serial(device, 2400)
        self.repeat = repeat
        self.wait = wait
        sleep(0.1)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    def close(self):
        '''Close underlying serial device connection.'''
        self._serial.close()
        
    def _process(self, instruction, byte, address):
        cksum = (243 - instruction - byte - address) & 255
        for i in range(self.repeat + 1):
            self._serial.write(bytearray([13, address, instruction, byte, cksum]))
            sleep(self.wait)
        
    def set(self, relay, address=1):
        '''Set `relay` (9 for all) of card at `address` (default 1).'''
        if not 0 < relay < 10:
            raise Exception('invalid relay number')
        self._process(83, relay+48, address&255)
        
    def clear(self, relay, address=1):
        '''Clear `relay` (9 for all) of card at `address` (default 1).'''
        if not 0 < relay < 10:
            raise Exception('invalid relay number')
        self._process(67, relay+48, address&255)
        
    def toggle(self, relay, address=1):
        '''Toggle `relay` (9 for all) of card at `address` (default 1).'''
        if not 0 < relay < 10:
            raise Exception('invalid relay number')
        self._process(84, relay+48, address&255)
        
    def set_address(self, new=1, address=1):
        '''Set address of card at `address` to `new`.'''
        self._process(65, new&255, address&255)
        
    def send_byte(self, num, address=1):
        '''Set relays to `num` (in binary mode).'''
        self._process(66, num&255, address&255)

    def emergency_stop(self):
        '''Clear all relays on all cards. emergency purpose.'''
        self._process(69, 1, 1)
        
    def force_address(self):
        '''Reset all cards to address 1.'''
        self._process(70, 1, 1)
        
    def get_address(self):
        '''Display card address on LEDs.'''
        self._process(68, 1, 1)


class Spectrograph():
    def __init__(self, device='/dev/cu.', simulator=False):
        if simulator:
            self.device = None # Replace with instance of K8056
            self.simulation = True
        else:
            self.device = K8056(device)
            self.simulation = False
        self.ports = {1:'mirror', 2:'led', 3:'thar', 4:'tung'}
        self.status = {0:0, 
                      1:0, 
                      2:0, 
                      3:0}
        # 0 = object, 1=dark, 2= flat, 3=thar
        self.observing_modes = {0: [0,0,0,0],
            1:[1, 0, 0, 0],
            2:[1, 1, 0, 0],
            3:[1, 0, 1, 0]}

    def set_mode(self, mode):
        for jj in range(4):
            if self.observing_modes[mode][jj] == 0:
                self.turn_off(jj)
            else:
                self.turn_on(jj)
 
    def turn_on(self, port):
        if self.device is not None:
            self.device.set(port)
        self.status[port] = 1
        global sio
        sio.emit('update', {'spectrograph':self.status})
    
    def turn_off(self, port):
        if self.device is not None:
            self.device.close(port)
        self.status[port] = 0
        sio.emit('update', {'spectrograph':self.status})


if __name__=='__main__':
    sio = socketio.Client()
    sio.connect('http://0.0.0.0:8081')
    spectrograph = Spectrograph(simulator=True)

    @sio.on('set_obs_type')
    def change_spectrograph_state(mode):
        print(mode)
        spectrograph.set_mode(mode)



