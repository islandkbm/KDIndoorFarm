import React, { useState, useEffect } from "react";
import myGlobalvalues from "../myGlobal";
import { connect } from 'react-redux';

import { actionSetvalue } from '../mainAction';



const Loginpage = (props) => {
  const [moutdevarray, setUpdate] = useState([]);
  useEffect(() => {
    let interval = null;

    
    return () => clearInterval(interval);
  }, [moutdevarray]);

  function inputonchangeHandler(e) {
    console.log("inputonchangeHandler : " + e.target.name);
    
  }
  function loginbuttonHandler(e) {
    console.log("loginbuttonHandler : " + e.target.name);

    props.dispatch(actionSetvalue(122));

     window.sessionStorage.setItem('provider',"kbm");    



  }

  return(
    <div>
        <h2>login Page</h2>
        <div key="sdaff">

        
            <label>암호: {props.value} </label>
            <input type="text" key="1234" name="devname" onChange={inputonchangeHandler} />
        <div className="out_button">
         <button className="button_on"  onClick={loginbuttonHandler }> 로그인 </button> 
        </div>

        </div>
    </div>
);

};


const mapStateToProps = function(state) {
    return {
     value: state.value,
     
    }
  }


export default connect(mapStateToProps)(Loginpage);
