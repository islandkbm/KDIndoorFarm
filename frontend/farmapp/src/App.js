import "./App.css";
import { Component } from "react";
import React, { useState, useEffect } from "react";
import IndoorFarmAPI from "./indoorfarmapi";
import manualMessage from "./manualmessage";

class OutputBox extends Component {
  render() {
    return (
      <div className="outputbox">
        <ul>{this.props.data.Name}</ul>
        <ul>{this.props.data.Status} </ul>
      </div>
    );
  }
}

function Outputdisplaytest(updateintervalmsec) {
  console.log("Outputdisplaytest 01");

  const [moutdevarray, setUpdate] = useState([]);

  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      IndoorFarmAPI.getoutputstatus().then((devices) => {
        setUpdate(devices);
      });
    }, updateintervalmsec);

    return () => clearInterval(interval);
  }, [moutdevarray]);

  return (
    <div className="outputtable">
      <h1>output display</h1>
      {moutdevarray.map((localState, index) => (
        <OutputBox data={localState} />
      ))}
    </div>
  );
}

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

function Sensordisplaytest(updateintervalmsec) {
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

function manualonoff(channel, onoff) {
  if (onoff == true) {
    console.log(" manualonoff  on channel : " + channel);
  } else {
    console.log(" manualonoff  off channel : " + channel);
  }

  const mdev = new manualMessage();
  mdev.hardwareChannel = channel;
  mdev.isonoff = onoff;

  IndoorFarmAPI.setmanualonoff(mdev);
}

function App() {
  const [hwchannel, sethwchannel] = useState(0);
  function handleChange(e) {
    sethwchannel(e.target.value);
    console.log(hwchannel);
  }

  return (
    <div className="App">
      channel :
      <input type="number" onChange={handleChange} min="0" max="23" />
      <button onClick={() => manualonoff(hwchannel, true)}>On</button>
      <button onClick={() => manualonoff(hwchannel, false)}>Off</button>
      <div className="sensorbocck">{Sensordisplaytest(2000)}</div>

       <div className="outputblock">{Outputdisplaytest(2000)}</div>

      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
