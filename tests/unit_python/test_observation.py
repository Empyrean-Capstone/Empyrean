
from api.main.models.observation import Observation
import pytest
from datetime import date

def test_new_observation():
    dictionary = {
        "object": 'm1',
        "progress": "Pending",
        "date": str(date.today())
        }
    observation = Observation(dictionary)
    assert observation.object == 'm1'
    assert observation.progress == 'Pending'
    assert observation.date == str(date.today() )
    assert observation.exp_time == None

def test_list_as_dictionary_observation():
    dictionary = ["m1", "Pending", str(date.today()) ]
    with pytest.raises(ValueError):
        observation = Observation( dictionary )

def test_int_as_dictionary_observation():
    dictionary = 3
    with pytest.raises( ValueError):
        observation = Observation( dictionary )

def test_int_as_key_observation():
    dictionary = {
        5: 'm1',
        "progress": "Pending",
        "date": str(date.today())
        }
    observation = Observation( dictionary )
    assert getattr( observation, "5" ) == 'm1'
    assert observation.progress == 'Pending'
    assert observation.date == str(date.today() )
    assert observation.exp_time == None
