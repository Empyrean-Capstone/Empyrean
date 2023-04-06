"""TODO."""

from . import logsheet
from .. import sio
from ..models.observation import Observation, get_logs_json_str


# TODO change this to a get request
@sio.on("retrieveObservations")
def get_all_log_data():
    """
    Gets every log in the database. 
    """
    
    # FIXME: get only the observations for the given logsheet
    observations = Observation.query.all()
    sio.emit("setObservations", get_logs_json_str(observations))

# TODO change this to a post request
@sio.on("retrieveDateObservations")
def get_date_log_data(calendarData):
    """
    Retrieve all of the logsheets with the specified parameters
    
    Parameters:
    -----------
        startDay : int
            Day of the month of the start date
        startMonth : int
            Month of the year of the start date
        startYear : int
            Year of the start date
        endDay : int
            Day of the month of the start date
        endMonth : int
            Month of the year of the start date
        endYear : int
            Year of the start date
    
    Returns:
    --------
        json Object 
            for all of the logsheets that were returned
    """
    
    startDay = calendarData["startDay"]
    startMonth = calendarData["startMonth"] + 1 # Why plus 1?
    startYear = calendarData["startYear"]

    endDay = calendarData["endDay"]
    endMonth = calendarData["endMonth"] + 1
    endYear = calendarData["endYear"]

    # FIXME: There should be a formatting function to do all of this
    # Sets the date to the correct format
    if startMonth < 10:
        startDate = "0" + str(startMonth)
    else:
        startDate = str(startMonth)
    startDate += "-"
    if startDay < 10:
        startDate += "0" + str(startDay)
    else:
        startDate += str(startDay)
    startDate += "-" + str(startYear)

    if endMonth < 10:
        endDate = "0" + str(endMonth)
    else:
        endDate = str(endMonth)
    endDate += "-"
    if endDay < 10:
        endDate += "0" + str(endDay)
    else:
        endDate += str(endDay)
    endDate += "-" + str(endYear)

    endDate += " 23:59:59"

    # Gets only the observations from the database between the time period
    observations = Observation.query.filter((Observation.date_obs >= startDate) & (Observation.date_obs <= endDate))

    sio.emit("setObservations", get_logs_json_str(observations))
