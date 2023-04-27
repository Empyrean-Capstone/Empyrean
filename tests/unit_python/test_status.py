from api.main.models.status import Status
import pytest

def test_new_status():
    """
    """
    name = "camera"
    instrumentID = 1
    value = "busy"
    color = "success"
    status = Status( instrumentID, name, value, color )
    assert "camera" == status.statusName 
    assert status.instrumentID == 1
    assert status.statusName == "camera"

def test_none_values_status():
    """
    """
    name = "camera"
    instrumentID = 1
    value = "busy"
    color = "success"
    with pytest.raises(TypeError):
        status = Status()
    with pytest.raises(TypeError):
        status = Status( statusName=name, statusValue=value, color=color)
    with pytest.raises(TypeError):
        status = Status( InstrumentID=instrumentID, statusValue=value, color=color)
    with pytest.raises(TypeError):
        status = Status( statusName=name, instrumentID=instrumentID, color=color)

def test_non_string_values_status():
    """
    """
    name = 3  
    instrumentID = 1
    value = "busy"
    color = "success"

    status = Status(instrumentID, name, value, color)
    assert status.statusName == str(3)

    name = 'camera'
    value = 3
    status = Status(instrumentID, name, value, color)
    assert status.statusValue == str(3)

    value = "busy"
    color = 3
    status = Status(instrumentID, name, value, color)
    assert status.color == str(3)

def test_empty_values_status():
    """
    """
    name = ""
    instrumentID = 1
    value = "busy"
    color = "success"

    with pytest.raises( ValueError ):
        status = Status( instrumentID, name, value, color )

    name = 'camera'
    value = ""
    with pytest.raises( ValueError ):
        status = Status( instrumentID, name, value, color )

    value = "busy"
    color = ""
    with pytest.raises( ValueError ):
        status = Status( instrumentID, name, value, color )

def test_whitespace_values_status():
    """
    """
    name = "       "
    instrumentID = 1
    value = "busy"
    color = "success"

    with pytest.raises( ValueError ):
        status = Status( instrumentID, name, value, color )

    name = 'camera'
    value = "                   "
    with pytest.raises( ValueError ):
        status = Status( instrumentID, name, value, color )

    value = "busy"
    color = "                                       "
    with pytest.raises( ValueError ):
        status = Status( instrumentID, name, value, color )
