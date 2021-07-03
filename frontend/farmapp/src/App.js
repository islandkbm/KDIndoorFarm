import "./App.css";

import React, { useState, useEffect } from "react";

import Loginpage from "./pages/loginpage";
import Mainpage from "./pages/mainpage";
import { connect } from "react-redux";
import { actionSetlogin } from "./mainAction";

import myGlobalvalues from "./myGlobal";
import IndoorFarmAPI from "./indoorfarmapi";

const os = require("os");

function App(props) {
  
  console.log("-------------------------react APP start---------------------");
  console.log("Hostname : " + os.hostname() + "OS Type : " + os.type() + "Platform : " + os.platform());
  console.log("myGlobalvalues count :" + myGlobalvalues.ncount++);



  let hostname = os.hostname();
  if (hostname.indexOf("localhost") != -1) {
    ///로컬로 접속하면 관리자 계정임
    myGlobalvalues.islocal = true;
    myGlobalvalues.isuseradmin = true;
  } else {
    myGlobalvalues.islocal = false;
    myGlobalvalues.isuseradmin = false;
  }

  console.log("App  islocal : " +myGlobalvalues.islocal);

  myGlobalvalues.farmapi = new IndoorFarmAPI(myGlobalvalues.islocal);

  

  useEffect(() => {
  

  let loginrole = window.sessionStorage.getItem("login");

    if(loginrole)
    {
    }
    else{
      loginrole ="logout";
    }
    props.onSetlogin(loginrole);
  

    console.log("App  LoginRole : " +props.LoginRole);
    
  }, []);



  return (<div className="App">{props.LoginRole == "logout" ?  Loginpage(props) : Mainpage(props)}</div>);
}

const mapStateToProps = function (state) {
  return {
    LoginRole: state.LoginRole,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onSetlogin: (value) => dispatch(actionSetlogin(value)),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(App);
