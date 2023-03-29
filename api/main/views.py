from main import app
#from core.models import db
import time

@app.route('/api/time')
def get_current_time():
    return { 'time': time.time() }
