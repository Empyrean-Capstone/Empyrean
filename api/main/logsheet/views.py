"""TODO."""

from . import logsheet
from .. import sio
from ..models.observation import Observation, get_logs_json_str


# TODO change this to a get request
@sio.on("retrieveObservations")
def get_all_log_data():
    """
    TODO.

    Args:
        data ():
    """
    observations = Observation.query.all()
    sio.emit("setObservations", get_logs_json_str(observations))
    
@sio.on("retrieveDateObservations")
def get_date_log_data(calendarData):
    startDay = calendarData['startDay']
    startMonth = calendarData['startMonth'] + 1
    startYear = calendarData['startYear']
    
    endDay = calendarData['endDay']
    endMonth = calendarData['endMonth'] + 1
    endYear = calendarData['endYear']
    
    if startMonth < 10:
        startDate = '0' + str(startMonth)
    else:
        startDate = str(startMonth)
    startDate += '-'
    if startDay < 10:
        startDate += '0' + str(startDay)
    else:
        startDate += str(startDay)
    startDate += '-' + str(startYear)
    
    
    if endMonth < 10:
        endDate ='0' + str(endMonth)
    else:
        endDate = str(endMonth)
    endDate += '-'
    if endDay < 10:
        endDate += '0' + str(endDay)
    else:
        endDate += str(endDay)
    endDate += '-' + str(endYear)
    
    endDate += ' 23:59:59'
    
    observations = Observation.query.where((Observation.date_obs >= startDate) & (Observation.date_obs <= endDate))
    
    sio.emit("setDateObservations", get_logs_json_str(observations))
