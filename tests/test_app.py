"""TODO."""
from api.main import app

import pytest


def main():
    """TODO."""

    app.config.update({"TESTING": True})

    assert(type(app) == None)




if __name__ == "__main__":
    main()
