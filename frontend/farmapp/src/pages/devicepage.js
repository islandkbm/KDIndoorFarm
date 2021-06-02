import React, {  useState, useEffect } from "react";
import Outputdevicedisplay from "../outputdevicedisplay";
import IndoorFarmAPI from "../indoorfarmapi";

const Devicepage = () => {

    const [moutdevarray, setUpdate] = useState([]);
  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      IndoorFarmAPI.getoutputstatus().then((devices) => {
        setUpdate(devices);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [moutdevarray]);


    return(

            <div className="output">{Outputdevicedisplay(moutdevarray,false)}</div>

    )
}

export default Devicepage;