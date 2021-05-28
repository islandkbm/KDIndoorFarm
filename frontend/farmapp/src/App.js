import "./App.css";

import React, {Component,  useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';



import  Dashboard from './pages/dashboard';
import  Sensorpage from './pages/sensorpage';
import  Devicepage from './pages/devicepage';
import  Autocontrolpage from './pages/autocontrolpage';
import  About from './pages/about';



function App() {
  const [hwchannel, sethwchannel] = useState(0);
  function handleChange(e) {
    sethwchannel(e.target.value);
    console.log(hwchannel);
  }

  return (
    <div className="App">

      <Router>
        <div className="mainbox">

          <div className="leftbox">
          <nav>
            <ul>
              <li>
                <Link to="/dashboard">대시보드</Link>
              
              </li>
              <li>
                <Link to="/sensor">센서</Link>
              </li>
              <li>
                <Link to="/devices">장비제어</Link>
              </li>
              <li>
                <Link to="/autocontrol">자동제어</Link>
              </li>
              <li>
                <Link to="/setup">설정</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
          </div>


          <div  className="rightbox">
          <Route path='/dashboard' component={Dashboard}/>
          <Route path='/devices' component={Devicepage}/>
          <Route path='/about' component={About}/>
          <Route path='/sensor' component={Sensorpage}/>
          <Route path='/autocontrol' component={Autocontrolpage}/>
          

          </div>

        </div>
      </Router>

      channel :
      <input type="number" onChange={handleChange} min="0" max="23" />
      

      <header className="App-header">

                
      </header>
    </div>
  );
}

export default App;
