from api.main.models.user import User
import pytest


def test_new_user():
    dictionary = {
        "username": 'testUsername',
        "password": "testPassword",
        "name": "Test Name", 
        "isAdmin": True
        }
    user = User(dictionary)
    assert user.username == 'testUsername'
    assert user.password == 'testPassword'
    assert user.name == "Test Name"
    assert user.isadmin == True 

def test_list_as_dictionary_user():
    dictionary = ["m1", "Pending", "Test Name"]
    with pytest.raises(ValueError):
        user = User( dictionary )

def test_int_as_dictionary_user():
    dictionary = 3
    with pytest.raises( ValueError):
        user = User( dictionary )

def test_int_as_key_user():
    dictionary = {
        5: 'm1',
        "progress": "Pending",
        "password": "testPassword"
        }
    user = User( dictionary )
    assert getattr( user, "5" ) == 'm1'
    assert user.progress == 'Pending'
    assert user.password == "testPassword" 
    assert user.id == None
