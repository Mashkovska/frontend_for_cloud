import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";

const WaterEndpoint =
  process.env.REACT_APP_WATER_BASE_URL + "/api/v1/water/";

function App() {
  const initialWater = [
    {
      id: null,
      temperature: null,
      pH_level: null,
      salt_content: null,
      oxygen_saturation: null,
      transparency: null
    }
  ];

  const [water, setWater] = useState(initialWater);
  const [averageWater, setAverageWater] = useState(initialWater);

  useEffect(() => {
    axios.get(WaterEndpoint).then(result => {
      setWater(result.data);
      setAverageWater(calculateAverageWater(result.data));
    });
  }, []);

  const removeWater = id => {
  //localhost:3000/api/v1/water/:id
    axios.delete(WaterEndpoint + id).then(result => {
      axios.get(WaterEndpoint).then(result => {
        setWater(result.data);
      setAverageWater(calculateAverageWater(result.data));
      });
    });
  };
  
  const addWater = water => {
    axios.post(WaterEndpoint, water).then(result => {
      axios.get(WaterEndpoint).then(result => {
        setWater(result.data);
      setAverageWater(calculateAverageWater(result.data));
      });
    });
  };

  function calculateAverageWater (waters) {
    const watersCount = waters.length;
    const watersSum =  waters.reduce((acc, water) => {
        return {
          temperature: parseFloat(acc.temperature) + parseFloat(water.temperature),
          pH_level: parseFloat(acc.pH_level) + parseFloat(water.pH_level),
          salt_content: parseFloat(acc.salt_content) + parseFloat(water.salt_content),
          oxygen_saturation: parseFloat(acc.oxygen_saturation) + parseFloat(water.oxygen_saturation),
        };
    });
    return {
         temperature: watersSum.temperature / watersCount,
         pH_level: watersSum.pH_level / watersCount,
         salt_content: watersSum.salt_content / watersCount,
         oxygen_saturation: watersSum.oxygen_saturation / watersCount,
       };
  }

  const handleSubmit = event => {
    event.preventDefault();
    const water = {
      temperature: event.target.temperature.value,
      pH_level: event.target.pH_level.value,
      salt_content: event.target.salt_content.value,
      oxygen_saturation: event.target.oxygen_saturation.value,
      transparency: event.target.transparency.value
    };
    event.target.reset();
    addWater(water);
  };

  const waterRows = water.map(water => {
    return (
      <tr key={water.id}>
        <td>{water.id}</td>
        <td>{water.temperature}</td>
        <td>{water.pH_level}</td>
        <td>{water.salt_content}</td>
        <td>{water.oxygen_saturation}</td>
        <td>{water.transparency}</td>
        <td
          className="remove"
          onClick={() => removeWater(water.id)}
        >
          <i className='fa fa-trash'></i>
        </td>
      </tr>
    );
  });

  return (
    <div className="app">
     <form className="form" onSubmit={handleSubmit}>
       <label>
         Temperature:
         <input type="text" name="temperature" placeholder="Temperature" />
       </label>
       <label>
         pH Level:
         <input type="text" name="pH_level" placeholder="pH Level" />
       </label>
       <label>
         Salt Content:
         <input
           type="text"
           name="salt_content"
           placeholder="Salt Content"
         />
       </label>
       <label>
         Oxygen Saturation:
         <input type="text" name="oxygen_saturation" placeholder="Oxygen Saturation" />
       </label>
       <label>
          Transparency:
          <input type="text" name="transparency" placeholder="Transparency" />
        </label>
       <input type="submit" value="Send"/>
     </form>

     <div className="average">
        <h3>Average values:</h3>
        <p>Temperature: {averageWater.temperature}</p>
        <p>pH Level: {averageWater.pH_level}</p>
        <p>Salt Content: {averageWater.salt_content}</p>
        <p>Oxygen Saturation: {averageWater.oxygen_saturation}</p>
     </div>


      <table className="table">
        <thead>
          <tr>
            <th>id</th>
            <th>temperature</th>
            <th>pH_level</th>
            <th>salt_content</th>
            <th>oxygen_saturation</th>
            <th>transparency</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{waterRows}</tbody>
      </table>
    </div>
  );
}

export default App;
