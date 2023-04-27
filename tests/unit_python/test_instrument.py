from api.main.models.instrument import Instrument
import pytest

def test_new_instrument():
    """
    """
    name = "spectrograph" 
    instrument = Instrument( name )
    assert name == instrument.instrumentName
    assert instrument.instrumentId == None
    assert instrument.instrumentName == "spectrograph"

def test_no_name_instrument():
    """
    """
    with pytest.raises(TypeError):
        instrument = Instrument()

def test_int_name_instrument():
    """
    """
    name = 3
    instrument = Instrument(name)
    assert instrument.instrumentName == str(3)

def test_empty_name_instrument():
    """
    """
    name = ""
    with pytest.raises( ValueError ):
        instrument = Instrument(name)

def test_whitespace_name_instrument():
    """
    """
    name = "     "
    with pytest.raises( ValueError ):
        instrument = Instrument( name )
