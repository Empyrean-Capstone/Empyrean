import socketio
# TODO look into whether or not we need this with flask or if flask replaces this
from aiohttp import web
from astropy.time import Time
from datetime import datetime
from termcolor import colored
from astroquery.simbad import Simbad
from astropy.coordinates import EarthLocation, SkyCoord, AltAz
import astropy.units as u
from time import sleep
Simbad.ROW_LIMIT = 1

def get_airmass(sc):
    t = Time.now()
    loc = EarthLocation.of_site('lowell')
    obj_altaz = sc.transform_to(AltAz(obstime=t, location=loc))
    return obj_altaz.alt.value


def resolve_target(target):
    qr = Simbad.query_object(target)
    sc = SkyCoord(qr[0]['RA'], qr[0]['DEC'], unit=(u.hourangle, u.deg))
    ra = sc.ra.to_string(unit=u.hourangle, sep=':', pad=True, precision=2)
    dec = sc.dec.to_string(unit=u.deg, sep=':', pad=True, precision=2, alwayssign=True)
    obj_alt = get_airmass(sc)
    print(obj_alt)
    if (obj_alt > 15) :
        obj_vis_bool = 'True'
    else:
        obj_vis_bool = 'False'
    global sio
    return ra, dec, f"{obj_alt:.2f}", f"{obj_vis_bool:s}"

# creates the server and allows all origins to access
sio = socketio.AsyncServer(async_mode='aiohttp', async_handlers=True,
    cors_allowed_origins='*', origins='*', always_connect=True)
intensityCounter = 0
app = web.Application() 

# attach the web.application object to the sio
sio.attach(app)
 
def print_message( message, color=None ):
    time_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    if color == None:
        color = 'white'
    else:
        color = color.lower()
        if color not in ['grey', 'red', 'green', 'yellow', 'blue', 'blue', 'cyan', 'white']:
            color = 'white'        
    print(colored("[{0:s}] {1:s}".format(time_str, message), color))
  
async def index(request):
    return web.Response(text='hello', content_type='text/html')

# 
@sio.on('newWebClient')
async def newWebClient(sid, message):
    global x
    # logging.info("New web client connected")
    print_message('New web client connected', color='blue')
    await sio.emit('update', x.vars)

@sio.on('resolve_target')
async def resolve(sid, data):
    ra, dec, alt, vis = resolve_target(data)
    global x 
    x.vars['target'] = {'ra':ra, 'dec':dec, 'alt':alt, 'vis':vis}
    await sio.emit('update', x.vars)

@sio.on('set_obs_type')
async def set_obs_type(sid, data):
    obs_types = {0:"obj", 1:"dark", 2:"flat", 3:"thar"}
    global x
    x.vars['obs_type'] = obs_types[data]
    await sio.emit('set_obs_type', data)
    await sio.emit('update', x.vars)

@sio.on('start_observation')
async def start_observation(sid, data):
    global x
    obs_type = data[0]
    nexp = data[1]
    texp = data[2]
    obs_types = {"obj":0, "dark":1, "flat":2, "thar":3}
    # this is letting the spectrograph know to set the obs type
    await sio.emit('set_obs_type', obs_types[obs_type])
    await sio.emit('begin_exposure', [nexp, texp])

# stopping the observation at this point doesn't make much sense
# we should ask about providing an emergency stop function
@sio.on('stop_observation')
async def stop_observation(sid):
    await sio.emit('end_exposure')

# are classes and global variables updated in some way that would
# require dr. llama to do this?
class variables():
    def __init__(self):
        self.vars = {}
 
@sio.on('get_all_variables')
async def get_all_variables(sid):
    print('getting all variables')
    global x
    for key in x.vars.keys():
        await sio.emit('update', x.vars[key])

@sio.on('update')
async def update(sid, data):
    global x
    for key in data.keys():
        x.vars[key] = data[key]
    await sio.emit('update', data)

 
 
 
@sio.event
def emit(sid, data):
    pass

# REMOVE, dr. llama created a class for variables 
x = variables()

app.router.add_get('/', index)
web.run_app(app, port=8081, host='0.0.0.0',access_log=None)


