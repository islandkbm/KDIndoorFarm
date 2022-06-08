import React, { useState, useEffect } from "react";
import Outputdevicedisplay from "../outputdevicedisplay";
import IndoorFarmAPI from "../indoorfarmapi";
import myGlobalvalues from "../myGlobal";

const Devicepage = () => {
  const [moutdevarray, setUpdate] = useState([]);
  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      myGlobalvalues.farmapi.getoutputstatus().then((devices) => {
        setUpdate(devices);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return( <div>{Outputdevicedisplay(moutdevarray, false)}</div>);
};

export default Devicepage;
