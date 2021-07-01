import "./App.css";

import React, { useState } from "react";
import { connect } from 'react-redux';

import Loginpage from "./pages/loginpage";
import Mainpage from "./pages/mainpage";



import myGlobalvalues from "./myGlobal";
import IndoorFarmAPI from "./indoorfarmapi";

const os = require("os");


function App(props) {
  


  console.log("-------------------------react APP start---------------------");
  console.log("Hostname : " + os.hostname() + "OS Type : " + os.type() + "Platform : " + os.platform());
  console.log("myGlobalvalues count :" + (myGlobalvalues.ncount++) );
  
  
  const provider = window.sessionStorage.getItem('provider');    
  console.log("provider :" + provider );

  let hostname = os.hostname();
  if (hostname.indexOf("localhost") != -1) {
    ///로컬로 접속하면 관리자 계정임
    myGlobalvalues.islocal = true;
    myGlobalvalues.isuseradmin = true;
  } else {
    myGlobalvalues.islocal = false;
    myGlobalvalues.isuseradmin = false;
  }

  myGlobalvalues.farmapi = new IndoorFarmAPI(myGlobalvalues.islocal);

  console.log(myGlobalvalues);


  return (
    <div className="App">
      {props.value === 178 ? (<Loginpage/> ): (<div>{Mainpage()}</div>)}
      
    </div>
  );
}

const mapStateToProps = function(state) {
  return {
   value: state.value,
   
  }
}

export default  connect(mapStateToProps)(App);
