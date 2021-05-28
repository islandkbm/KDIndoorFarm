
import React, { Component,useState, useEffect } from "react";
import IndoorFarmAPI from "./indoorfarmapi";


class SensorBox extends Component {
    render() {
      return (
        <div className="sensorbox">
          <ul>{this.props.data.Name}</ul>
          <ul>{this.props.data.valuestring} </ul>
          <ul>{(this.props.data.errorcount >30)? "연결끊김" :("Err=" + this.props.data.errorcount)} </ul>
        </div>
      );
    }
  }

  function Sensordisplay(updateintervalmsec, isonlystatus) {
    console.log("Sensordisplaytest 01");
  
    const [msensorsarray, setSensors] = useState([]);
  
    useEffect(() => {
      let interval = null;
  
      interval = setInterval(() => {
        IndoorFarmAPI.getsensordatas().then((sensors) => {
          setSensors(sensors);
        });
      }, updateintervalmsec);
  
      return () => clearInterval(interval);
    }, [msensorsarray]);
  
    return (
      <div className="sensortatble">
        <h1>sensor display</h1>
        {msensorsarray.map((localState, index) => (
          <SensorBox data={localState} />
        ))}
      </div>
    );
  }


  

export default Sensordisplay;