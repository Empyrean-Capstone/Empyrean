"""TODO."""
from flask import session

from main import db
from . import logsheet
from .. import sio
from ..models.observation import Observation, get_logs_json_str
from ..models.logsheet import Logsheet


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
    startDay = calendarData["startDay"]
    startMonth = calendarData["startMonth"] + 1
    startYear = calendarData["startYear"]

    endDay = calendarData["endDay"]
    endMonth = calendarData["endMonth"] + 1
    endYear = calendarData["endYear"]

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

    observations = Observation.query.filter((Observation.date_obs >= startDate) & (Observation.date_obs <= endDate))

    sio.emit("setObservations", get_logs_json_str(observations))


@logsheet.get("/")
def get_all_logsheets():
    cur_userid = session.get("userid")

    logsheets = Logsheet.query.filter_by(userid=cur_userid).all()

    data = [list(row) for row in logsheets]

    sio.emit("setLogsheets", data)

    return "success", 200


def create_logsheet(userid):
    new_logsheet = Logsheet(userid)

    db.session.add(new_logsheet)
    db.session.commit()

    print([item for item in new_logsheet])

    sio.emit("updateLogsheets", [item for item in new_logsheet])

    return new_logsheet.id, 201
