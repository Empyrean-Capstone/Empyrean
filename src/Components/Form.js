import React,{ useState } from 'react';
import APIService from '../Components/APIService'


const Form = (props) => {
    const [name, setName] = useState('')

    const submitPlanet = () =>{
      APIService.SubmitPlanet({name})
      .then((response) => props.submitedPlanet(response))
      .catch(error => console.log('error',error))
    }

    const handleSubmit=(event)=>{ 
      event.preventDefault()
      submitPlanet()
      setName('')
    }

  return (
    <div className="shadow p-4">
        <form onSubmit = {handleSubmit} >
          <label htmlFor="name" className="form-label">Name of Planet </label>
          <input 
            type="text"
            className="form-control" 
            placeholder ="Enter name of a planet"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />

          <button 
          className="btn btn-primary mt-2"
          >
            Submit
          </button>
        </form>
    </div>
  )}

export default Form;
