
import React, { Component,useState, useEffect } from "react";
import Sensordisplay from "../sensordisplay";
import Outputdevicedisplay from "../outputdevicedisplay";
import IndoorFarmAPI from "../indoorfarmapi";
import responseMessage from "../commonjs/responseMessage"
import myGlobalvalues from "../myGlobal";



const Dashboard = () => {

    const [mresponse, setUpdatedata] = useState(new responseMessage());

    //const [msensorsarray, setUpdatesensor] = useState([]);
    //const [moutdevarray, setUpdatedevice] = useState([]);

    useEffect(() => {
      let interval = null;
  
      interval = setInterval(() => {

        myGlobalvalues.farmapi.getRequest(true,true,false).then((mrsp) => {
            setUpdatedata(mrsp);

        });

      }, 1000);
  
      return () => clearInterval(interval);
    }, []);


    return(
      <div className="display">
        
            {Sensordisplay(mresponse.Sensors,true)}
            {Outputdevicedisplay(mresponse.Outputs,true)}

        </div>
    )
}

export default Dashboard;