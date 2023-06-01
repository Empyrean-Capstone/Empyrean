"""
Integration tests for Zwocamera.

Note: requires that camera is plugged in.
"""

from instrument_interfaces.camera.zwo.zwo_camera import ZwoCamera

import pytest

cam_name = "ZWO ASI120MM-S"
lib_path = "/home/m/files/projects/empyrean/ASI_linux_mac_SDK_V1.28/lib/x64/libASICamera2.so.1.27"


def test_Zwocamera_init(capsys):
    """TODO."""

    with pytest.raises(OSError):
        ZwoCamera("test", "test")

    with pytest.raises(SystemExit):
        ZwoCamera(lib_path, "test")

    out, _ = capsys.readouterr()

    assert out == "No cameras found\n" or \
            out == "ERR: Couldn't find specified camera 'test' in list of connected cameras. Exiting...\n"
