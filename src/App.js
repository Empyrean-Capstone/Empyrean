import React, { useState } from 'react';
import Form from "./Components/Form";
import './App.css';

function App() {
    const [planet, setPlanet ] = useState('');
    const [showForm, setShowForm] = useState(false);

    const submitedPlanet = (planet) =>{
      const new_planet = planet
      setPlanet(planet)
    }
    
  return (
    <div className="App">
      <div className="container">
        <div className="row p-3">
          <div className="text-center">
            <h1>Send Data to Another Server.</h1>
            <Form 
              submitedPlanet={submitedPlanet}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
