import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import { connect } from 'react-redux';
import { actionSetlogin } from '../mainAction';



import Dashboard from "./dashboard";
import Sensorpage from "./sensorpage";
import Devicepage from "./devicepage";
import Autocontrolpage from "./autocontrolpage";
import Settingpage from "./settingpage";
import About from "./about";
import Factorysetup from "./rasberryonly/factorysetup";


import myGlobalvalues from "../myGlobal";

const Mainpage = (props) => {
  
    let adminmenu;

  console.log("-------------------------main page ---------------------");

  
  if (myGlobalvalues.isadmin === false) {
    adminmenu = (
      <Link to="/about" className="linkmenu">
        <div className="content">
          <img src="./image/s_set.png" className="con_img" /> user 
        </div>
      </Link>
    );
  } else {
    adminmenu = (
      <Link to="/about" className="linkmenu">
        <div className="content">
          <img src="./image/s_set.png" className="con_img" /> admin 
        </div>
      </Link>
    );
  }

  function logoutbuttonHandler(e) {
    


    window.sessionStorage.setItem('login',"logout"); 
    props.onSetlogin("logout");


  }




  return (
        
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

                <Link to="/about" className="linkmenu">
                    <div className="content">
                    <img src="./image/s_set.png" className="con_img" />{props.LoginRole}
                    </div>
                </Link>
                
      
              </div>
            </nav>
          </div>

          <div className="right">
            <div className="top">
              <div className="top_name"> NO. 1 &nbsp;&nbsp; SENSOR NODE</div>
              <div className="top_log">
              

                <div className="login">
                <div className="out_button">
                <button className="button_on"  onClick={logoutbuttonHandler }> 로그아웃 </button> 
                </div>

                </div>
                <div className="join">{myGlobalvalues.islocal? "로컬":"원격"}</div>
              </div>
            </div>

            <div className="board">
              <Switch>

              
              
              

                <Route path="/dashboard" component={Dashboard} />
                <Route path="/devices" component={Devicepage} />
              
                <Route path="/sensor" component={Sensorpage} />
                <Route path="/autocontrol" component={Autocontrolpage} />
                <Route path="/setup" component={Settingpage} />
                {props.LoginRole == "admin" ?  (<Route path="/about" component={About} exact/> ): (<Route path="/about" component={Factorysetup} exact />)}
                <Route path="/" component={Dashboard} exact />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
      
  );

};


  
  export default  Mainpage;

  