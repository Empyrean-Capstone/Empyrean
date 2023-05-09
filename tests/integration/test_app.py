"""
Tests that exercise the Flask application's responses to stimuli from clients.

As of v0.1, events that the application must accept from clients include:
    I. Instrument:
        A. update_status: updates status of items in the application database
            sends:
                1. instrument ID: int
                2. dictionary
                    {
                        status name: {
                            "value": status value,
                            "color": MUI color to style status with
                        }
                    }

    II. Camera:
        A. save_img: sends an image and metadata to the application
           to be processed and saved into the host file system

           sends:
               1. file name of image: string
               2. exposure data: dictionary of metadata about the image
               3. observation request instructions: dictionary of
                  observation instructions from user in front-end

        B. exposure_complete: signal to application that the current
           observation batch job is complete.

            sends nothing
"""

import tempfile

import flask
import numpy as np
import pytest

from main import app, db, sio
from main.models import status, observation


# ----------------------------------------------
# Utilities
# ----------------------------------------------
def setup():
    with app.app_context():
        db.create_all()

    return sio.test_client(app)


def teardown():
    with app.app_context():
        db.session.remove()
        db.drop_all()


# ----------------------------------------------
# Tests
# ----------------------------------------------
def test_app_init():
    """Test that the flask app exists and is valid."""
    assert isinstance(app, flask.app.Flask)


def test_client_init():
    """
    Test that the app can produce working test clients.

    Given a verified-functioning Flask application
    When we create SocketIO clients to the application
    Then we should have a unique, connected SocketIO client
    """
    client1 = sio.test_client(app)
    client2 = sio.test_client(app)

    assert client1.is_connected()
    assert client2.is_connected()
    assert client1.eio_sid != client2.eio_sid

    client1.disconnect()
    assert not client1.is_connected()

    client2.disconnect()
    assert not client2.is_connected()


def test_instrument_update_status():
    """
    Test that the app can receive and handle status updates.

    Given a Flask app and an operating camera client
    When the camera client emits a properly-constructed status update
    Then the app should store the contents of that update in the application database
    """

    # set up client and test database
    test_cam = setup()

    # successful usage
    status_update: dict = {"Camera": {"value": "Idle", "color": "success"}}

    test_cam.emit("update_status", 1, status_update)

    with app.app_context():
        cur_status = status.Status.query.filter_by(statusName="Camera").first()

    assert cur_status.statusValue == "Idle"
    assert cur_status.color == "success"

    # Failed usage: value isn't given
    status_update: dict = {"Camera": {"value": "Busy"}}

    with pytest.raises(KeyError):
        test_cam.emit("update_status", 1, status_update)

    # Failed usage: color isn't given
    status_update: dict = {"Camera": {"color": "success"}}

    with pytest.raises(KeyError):
        test_cam.emit("update_status", 1, status_update)

    # Teardown
    teardown()


def test_camera_save_img():
    """
    Test that the app can receive and handle images from the camera client.

    Given a Flask app and camera client that has taken an image
    When the camera client emits a properly-constructed image save request
    Then the app should store the contents of that update in the application database and
        create a FITS file from the data.
    """
    # set up client and test database
    test_cam = setup()

    # successful usage
    tmp = tempfile.NamedTemporaryFile(
        delete=False, mode="w", prefix="empyrean", suffix=".npy"
    )
    image = []
    request_instructions: dict = {
        "altitude": "0",
        "declination": "00:00:00.00",
        "num_exposures": "1",
        "object": "test",
        "observer": "Test Name",
        "obs_type": "object",
        "right_ascension": "+00:00:00.00",
    }

    with app.app_context():
        new_observe = observation.Observation(request_instructions)
        db.session.add(new_observe)
        db.session.commit()

        cur_exp_data: dict = {
            "OBSID": new_observe.id,
            "DATE-END": "1992-07-20T01:50:00.000",
            "DATE-OBS": "2023-07-20T01:50:00.000",
            "EXPTIME": "1",
            "GAIN": "0",
            "OFFSET": "0",
            "INSTRUME": "0",
            "OBJECT": "0",
            "AIRM": "0",
        }

        np.save(tmp.name, image)

        test_cam.emit("save_img", tmp.name, cur_exp_data, request_instructions)

        assert (
            observation.Observation.query.filter_by(id=cur_exp_data["OBSID"]).first()
            is not None
        )

    # Failed usage: missing altitude key in request when obs_type is Object
    del request_instructions["altitude"]

    with app.app_context():
        new_observe = observation.Observation(request_instructions)
        db.session.add(new_observe)
        db.session.commit()

        np.save(tmp.name, image)

        with pytest.raises(KeyError):
            test_cam.emit("save_img", tmp.name, cur_exp_data, request_instructions)

    request_instructions["altitude"] = "0"

    # Failed usage: missing EXPTIME in resulting exposure data
    del cur_exp_data["EXPTIME"]

    with app.app_context():
        new_observe = observation.Observation(request_instructions)
        db.session.add(new_observe)
        db.session.commit()

        np.save(tmp.name, image)

        with pytest.raises(KeyError):
            test_cam.emit("save_img", tmp.name, cur_exp_data, request_instructions)

    cur_exp_data["EXPTIME"] = "1"

    # Teardown
    teardown()


def test_camera_exposure_complete():
    test_cam = setup()

    with app.app_context():
        new_system_status = status.Status(0, "System", "Busy", "warning")
        db.session.add(new_system_status)
        db.session.commit()

    test_cam.emit("exposure_complete")

    with app.app_context():
        cur_status = status.Status.query.filter_by(statusName="System").first()
        assert cur_status.statusValue == "Ready"

    teardown()
