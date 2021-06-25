import "./App.css";

import React, {  useState } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Sensorpage from "./pages/sensorpage";
import Devicepage from "./pages/devicepage";
import Autocontrolpage from "./pages/autocontrolpage";
import Settingpage from "./pages/settingpage";
import About from "./pages/about";

const os = require("os");

// 사용자 페이지접근 권한
const myRole = {
  islocal: true,  // 로컬, 원격
  isadmin: true, // 관리자, 사용자
}


function App() {
  const [hwchannel, sethwchannel] = useState(0);

  let adminmenu;

  console.log("-------------------------react start---------------------");
  console.log(myRole);
  console.log('Hostname : ' + os.hostname());
  console.log('OS Type : ' + os.type());
  console.log('Platform : ' + os.platform());
  

let hostname =os.hostname();

  if (myRole.isadmin === false) {
    
    adminmenu = (
      <Link to="/about" className="linkmenu">
      <div className="content">
        <img src="./image/s_set.png" className="con_img" /> {hostname}
      </div>
    </Link>
    );

  } else {
    adminmenu = (
      <Link to="/about" className="linkmenu">
      <div className="content">
        <img src="./image/s_set.png" className="con_img" /> {hostname}
      </div>
    </Link>
    );
  }



  return (
    <div className="App">

      
      <Router>
        <div className="indoor">
          <div className="left">
            <nav>
            <div className="name">
              <img src="./image/kdgb.png" className="name_img" /> SFC-300
            </div>
            <div className="menu">
              <Link to="/dashboard" className="linkmenu">
                <div className="content">
                  <img src="./image/s_dash.png" className="con_img" /> DASH BOARD
                </div>
              </Link>
              <Link to="/sensor" className="linkmenu">
                <div className="content">
                  <img src="./image/s_sen.png" className="con_img" /> SENSOR
                </div>
              </Link>
              <Link to="/devices" className="linkmenu">
                <div className="content">
                  <img src="./image/s_dev.png" className="con_img" /> DEVICE
                </div>
              </Link>
              <Link to="/autocontrol" className="linkmenu">
                <div className="content">
                  <img src="./image/s_aut.png" className="con_img" /> AUTOCONTROL
                </div>
              </Link>
              <Link to="/setup" className="linkmenu">
                <div className="content">
                  <img src="./image/s_set.png" className="con_img" /> SETTING
                </div>
              </Link>
              {adminmenu}


            </div>
            </nav>
          </div>

          <div className="right">
            <div className="top">
              <div className="top_name"> NO. 1 &nbsp;&nbsp; SENSOR NODE</div>
              <div className="top_log">
                <div className="login">LOG IN</div>
                <div className="join">JOIN</div>
              </div>
            </div>

            <div className="board">
              
              <Switch>
              
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/devices" component={Devicepage} />
              <Route path="/about" component={About} role={myRole} />
              <Route path="/sensor" component={Sensorpage} />
              <Route path="/autocontrol" component={Autocontrolpage} />
              <Route path="/setup" component={Settingpage} />
              <Route path="/" component={Dashboard} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
