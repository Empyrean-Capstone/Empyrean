from api.main import db, app


class User(db.Model):
    """
    Holds the model for the User table in the database.

    Attributes:
    -----------
        id : int
            Database identifier
        username: str
            Represents their login username and display name
        password: str
            Represents the password of the user
        name: str
           The actual name of the user or organization
        isadmin: bool
            Represents the role of the user

    Methods:
    --------
        get_creds()
            Returns the attributes of the class in array form
        set_attrs( attrs )
            Updates the attributes of the object
    """

    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String())
    name = db.Column(db.String())
    password = db.Column(db.String())
    isadmin = db.Column(db.Boolean)

    def __init__(self, init_data: dict):
        """
        Initializes the user with values

        Parameters:
        -----------
            init_data : dict
                Default values for the new user
        """
        if type(init_data) is dict:
            self.set_attrs(init_data)
        else:
            raise ValueError( 'init_data must be iterable like a dictionary' )

    def __iter__(self):
        """
        Return:
        -------
            iter
                The attributes of the user in an iterable
        """

        return iter([self.id, self.username, self.name, self.password, self.isadmin])

    def get_creds(self):
        """
        Returns:
        --------
            list
                The list of all attributes of the object
        """

        return [item for item in self]

    def set_attrs(self, attrs: dict):
        """
        For all of the attributes, sets their value to the default value given

        Parameters:
        -----------
            attrs: dict
                The values to set the user's attributes to
        """

        for key, val in attrs.items():
            key = str(key).lower()
            setattr(self, key, val)
