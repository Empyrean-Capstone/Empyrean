"""TODO."""

import json
from api.main import db


def get_logs_json_str(observations: list):
    """
    TODO.

    Args:
        observations ():

    Returns:
        str: jsonified dictionary of observation data
    """
    rows: dict = {}

    for obs in observations:
        log: dict = obs.get_log_dict()
        rows |= log

    return json.dumps(rows)


class Observation(db.Model):
    """
    The python object representation of the Observation table of the database

    Attributes:
    -----------
        airm : Float
        ccd_temp: Float
        date_made_open_source: date
        date_obs : date
        exp_time : int
        filename : str
        gain : float
        gamma : float
        id : int
        image_typ : str
        instrume : str
        log_id : str
        mjdobs : float
        object : str
        obs_type : str
        observer : str
        offset : float
        owner_id : int
        reworder : str

    Methods:
    --------
        get_log_dict():
            Get the values of the observations in a way that the frontend can read
        set_attrs():
            Set values of the observation to update or instantiate an observation
    """

    airm = db.Column(db.Float)
    ccd_temp = db.Column(db.Float)
    date_made_open_source = db.Column(db.DateTime)
    date_obs = db.Column(db.DateTime)
    exp_time = db.Column(db.Integer)
    filename = db.Column(db.String)
    gain = db.Column(db.Float)
    gamma = db.Column(db.Float)
    id = db.Column(db.Integer, primary_key=True)
    image_typ = db.Column(db.String)
    instrume = db.Column(db.String)
    log_id = db.Column(db.String)
    mjdobs = db.Column(db.Float)
    object = db.Column(db.String)
    obs_id = db.Column(db.String)
    obs_type = db.Column(db.String)
    observer = db.Column(db.String)
    offset = db.Column(db.Float)
    owner_id = db.Column(db.Integer)
    reworder = db.Column(db.String)
    status = db.Column(db.String, default="Pending")

    def __init__(self, init_dict: dict):
        """
        Intialized the observation with the given devault values

        Parameters:
        -----------
            init_diect : dict
                Initial values for the attributes above
                Note: not all are needed, many can be initialized initially
                      as null.
        """
        self.set_attrs(init_dict)

    def __iter__(self):
        """
        Create an iterable list of the attributes of this object
        """

        return iter([self.id, self.object, "In Progress", str(self.date_obs), "None"])

    def get_log_dict(self):
        """
        Returns this object with fewer attributes to be used on the frontend
        TODO: Find out how to calculate a correct signal-to-noise

        Returns:
        --------
            dict
                A dictionary of the logsheet ready for representation
        """
        target: str = (
            self.object if self.obs_type.lower() == "object" else self.obs_type.lower()
        )

        return {
            self.id: {
                "target": target,
                "progress": self.status,
                "date": str(self.date_obs),
                "sigToNoise": "$50",
            }
        }

    def set_attrs(self, attrs: dict):
        """
        Sets the attributes of the object. Can be used to update or initialize
        the object.

        Parameters:
        -----------
            attrs : dict
                Of all of the attributes to be upgraded
        """

        for key, val in attrs.items():
            key = str(key).lower()
            setattr(self, key, val)
