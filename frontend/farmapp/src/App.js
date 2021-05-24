import './App.css';
import { Component } from "react";
import React, { useState, useEffect } from "react";
import IndoorFarmAPI from "./indoorfarmapi";
import manualMessage from "./manualmessage";



let ncount=0;

function Imagedisplaytest(updateintervalmsec) {
  console.log("imagedisplaytest 01");

  
  const [imgsrc, setImagesr] = useState("");
  

  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      
      

      
      let urlimg = "http://192.168.66.1:9527/ipc_snapshot.cgi?user=admin&pwd=admin&2021" +(ncount);

      let imgss2 = new Image();
      imgss2.crossOrigin='anonymous';
      imgss2.src =urlimg;
      imgss2.onload = function()
      {
          
          console.log("imgss22 onload  : " + ncount );
          let urlimg = "http://192.168.66.1:9527/ipc_snapshot.cgi?user=admin&pwd=admin&2021" +(ncount);
          setImagesr(urlimg);
          ncount++;

      };
     



    }, updateintervalmsec);

    return () => clearInterval(interval);
  }, [imgsrc]);

  return (
    <div className="sensortatble">
      <h1>sensor display</h1>
      <img src= {imgsrc}></img>
    </div>
  );
}



class SensorBox extends Component {
  render() {
    return (
      <div className="sensorbox">
        <ul>{this.props.data.Name}</ul>
        <ul>{this.props.data.valuestring} </ul>
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
    

  if(onoff ==true)
  {
    console.log(" manualonoff  on channel : " + channel);
  }else{
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
    sethwchannel( e.target.value);
    console.log(hwchannel);
  }

  
  return (
    <div className="App">

channel : 
      <input type="number" onChange ={handleChange} min="0" max="23"  />

      <button onClick={()=>manualonoff(hwchannel,true)}>On</button>
      <button onClick={()=>manualonoff(hwchannel,false)}>Off</button>


      <div className="sensorbocck">



{Sensordisplaytest(2000)}
</div>


      <header className="App-header">
        
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
