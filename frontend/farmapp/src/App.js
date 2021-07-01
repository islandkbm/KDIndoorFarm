import "./App.css";

import React, {  useState } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Sensorpage from "./pages/sensorpage";
import Devicepage from "./pages/devicepage";
import Autocontrolpage from "./pages/autocontrolpage";
import Settingpage from "./pages/settingpage";
import About from "./pages/about";
import manistore from "./store"
import myGlobalvalues from "./myGlobal";
import IndoorFarmAPI from "./indoorfarmapi";



const os = require("os");



function App() {
  const [hwchannel, sethwchannel] = useState(0);

  let islogin=false;
  let adminmenu;

  console.log("-------------------------react start---------------------");
  
  console.log('Hostname : ' + os.hostname());
  console.log('OS Type : ' + os.type());
  console.log('Platform : ' + os.platform());


  myGlobalvalues.isadmin=false;

  

let hostname =os.hostname();

if(hostname.indexOf("localhost") != -1)
{
  myGlobalvalues.islocal=true;
}
else{
  myGlobalvalues.islocal=false;
}

myGlobalvalues.farmapi =new IndoorFarmAPI(myGlobalvalues.islocal);

console.log(myGlobalvalues);



  if (myGlobalvalues.isadmin === false) {
    
    adminmenu = (
      <Link to="/about" className="linkmenu">
      <div className="content">
        <img src="./image/s_set.png" className="con_img" /> user {hostname}
      </div>
    </Link>
    );

  } else {
    adminmenu = (
      <Link to="/about" className="linkmenu">
      <div className="content">
        <img src="./image/s_set.png" className="con_img" /> admin :{hostname}
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

              {(islogin===true) ? (
						<Route path="/" component={About}/>
					) : (
            <div>
					    <Route path="/dashboard" component={Dashboard} />
              <Route path="/devices" component={Devicepage} />
              <Route path="/about" component={About}  />
              <Route path="/sensor" component={Sensorpage} />
              <Route path="/autocontrol" component={Autocontrolpage} />
              <Route path="/setup" component={Settingpage} />
              <Route path="/" component={Dashboard} exact />
            </div>

					)}
              
              
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
