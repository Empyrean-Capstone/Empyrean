"""TODO."""

import os
import sys


def get_env_variable(name: str) -> str:
    """
    Return Flask environment vars.

    Args:
        name (str): environment variable to retrieve.

    Returns:
        str: environment var or exception
    """
    key = os.environ.get(name)

    if key is None:
        print(f"Env variable '{name}' not set. Exiting...")
        sys.exit(0)

    return key
