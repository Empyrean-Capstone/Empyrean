"""
Integration tests for Zwocamera.

Note: requires that camera is plugged in.
"""

from instrument_interfaces.camera import Zwocamera

import pytest

cam_name = "ZWO ASI120MM-S"
lib_path = "/home/m/files/school/coursework/undergraduate/cs/capstone/app/ASI_linux_mac_SDK_V1.28/lib/x64/libASICamera2.so.1.27"


def test_Zwocamera_init(capsys):
    """TODO."""

    with pytest.raises(OSError):
        Zwocamera("test", "test")

    with pytest.raises(SystemExit):
        Zwocamera(lib_path, "test")

    out, _ = capsys.readouterr()

    assert out == "No cameras found\n" or \
            out == "ERR: Couldn't find specified camera 'test' in list of connected cameras. Exiting...\n"
