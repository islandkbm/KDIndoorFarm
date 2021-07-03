
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
            <label>ID:  </label>
            <input type="text" key="1234333" name="inputloginid" onChange={inputonchangeHandler} />
          </div>
       
      );
    } else {
        logintype = (
        <div className="content">
            <label>간편로그인:  </label>
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

        
            <label>암호:  </label>
            <input type="text" key="1234" name="inputloginpw" onChange={inputonchangeHandler} />
        <div className="out_button">
         <button className="button_on"  onClick={loginbuttonHandler }> 로그인 </button> 
        </div>

        </div>
    </div>
);

};


//export default connect(mapStateToProps,mapDispatchToProps)(Loginpage);

export default Loginpage;
