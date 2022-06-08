
import React, { useState, useEffect } from "react";
import myGlobalvalues from "../myGlobal";

const crypto = require('crypto');



const Loginpage=(props)=>{

    let loginid;
    let loginpw;

    
    let logintype;

    
    console.log("Loginpage  :" + props.Islogin)  ;
    
    console.log("Loginpage islocal :" + myGlobalvalues.islocal)  ;
    
    if (myGlobalvalues.islocal === false) {
        logintype = (
       
          <div className="content">
        
                <button className="button"  onClick={logingoogle }> 구글로그인 </button> 
                <button className="button"  onClick={loginkakao }> 카카오톡로그인 </button> 
                <button className="button"  onClick={loginbuttonHandler }> 회원가입 </button> 
          </div>
       
      );
    } else {
        logintype = (
        <div className="">
            <label>간편로그인:  </label>
            
            
            <div>
            <label>암호:  </label>
            <input type="text" key="1234" name="inputloginpw" onChange={inputonchangeHandler} />
            <button className=""  onClick={loginbuttonHandler }> 로그인 </button> 
            </div>
            
          </div>
      );
    }



  function inputonchangeHandler(e) {
    console.log("inputonchangeHandler : " + e.target.name);
    switch (e.target.name) {
        case "inputloginid":
            loginid= e.target.value;
          break;
  
        case "inputloginpw":
            loginpw= e.target.value;
  
          break;
      }


    
  }
  
  
  function logingoogle(e) {
    console.log("logingoogle : " + e.target.name + " id : " + loginid + " , pw : " + loginpw);

    let retrole= "admin";
    window.sessionStorage.setItem('login',retrole); 
    props.onSetlogin(retrole);
  }

  
  function loginkakao(e) {
    console.log("loginkakao : " + e.target.name + " id : " + loginid + " , pw : " + loginpw);

    let retrole= "user";
    window.sessionStorage.setItem('login',retrole); 
    props.onSetlogin(retrole);
  }

  function loginbuttonHandler(e) {
    console.log("loginbuttonHandler : " + e.target.name + " id : " + loginid + " , pw : " + loginpw);


    myGlobalvalues.farmapi.setLogin(loginid,loginpw).then((ret) => {
        
        if(ret)
    {
        if(ret.IsOK == true)
        {
            window.sessionStorage.setItem('login',ret.retMessage); 
            props.onSetlogin(ret.retMessage);
            
            console.log( " login ret : " +ret.retMessage);

        }

    }
      });
    


    
    
    

     //window.sessionStorage.setItem('login',"true");    

  }


  return(
    <div>
        <h2>login Page</h2>
        <div key="sdaff">
            {logintype}

        
            

        </div>
    </div>
);

};


//export default connect(mapStateToProps,mapDispatchToProps)(Loginpage);

export default Loginpage;
