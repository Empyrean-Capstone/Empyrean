from main import app
#from core.models import db
import time

@app.route('/time')
def get_current_time():
    return { 'time': time.time() }
