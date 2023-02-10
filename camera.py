from time import sleep
import socketio
from tqdm.auto import tqdm, trange

class Camera():
    def __init__(self, device='/dev/cu.', simulator=False):
        if simulator:
            self.device = None # Replace with instance of K8056
            self.simulation = True
        else:
            self.device = "Connection to Camera goes here"
            self.simulation = False

    def expose(self, nexp, itime):
        if self.simulation:
            global sio
            global continue_obs
            continue_obs = True
            for kk in trange(int(nexp)):
                for jj in trange(int(itime)):
                    sio.emit('update', {'camera':'Busy'})
                    sio.emit('update', {'current_exposure':
                            {'obs_id':'20220101.001.1001', 
                            'itime_elapsed':jj, 
                            'itime_total':int(itime),
                            'exp_number':int(kk), 
                            'nexp_total':int(nexp)}})
                    sleep(1)
                if continue_obs == False:
                    break
            sio.emit('update', {'camera':'Idle'})
            sio.emit('set_obs_type', 0)
            sio.emit('update', {'current_exposure':
                {'obs_id':0, 'itime_elapsed':0, 'exp_number':0,'itime_total':1, 'nexp_total':1}})


if __name__=='__main__':
    camera = Camera(simulator=True)
    sio = socketio.Client()
    sio.connect('http://0.0.0.0:8081')
    # TODO ask for ID based on name
    # if ID is not found register in the database
    continue_obs = True
    @sio.on('begin_exposure')
    def begin_exposure(data):
        print(data)
        nexp = data[0]
        itime = data[1]
        camera.expose(nexp, itime)
    
    @sio.on('end_exposure')
    def end_exposure():
        global continue_obs 
        continue_obs = False