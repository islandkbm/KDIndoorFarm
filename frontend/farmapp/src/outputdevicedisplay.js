import React, { Component, useState, useEffect } from "react";
import IndoorFarmAPI from "./indoorfarmapi";
import manualMessage from "./manualmessage";
import Outputdevice from "./commonjs/outputdevice";

function manualonoff(channel, onoff) {
  if (onoff == true) {
    console.log(" manualonoff  on channel : " + channel);
  } else {
    console.log(" manualonoff  off channel : " + channel);
  }

  const mdev = new manualMessage();
  mdev.hardwareChannel = channel;
  mdev.isonoff = onoff;

  IndoorFarmAPI.setmanualonoff(mdev);
}

function outputdevbox(mydata, isonlystatus) {
  console.log("outputdevbox 01 : " + isonlystatus);
  let ismanual;

  if (mydata.Status === Outputdevice.OPStatus.OPS_Local) {
    ismanual = <ul>현장제어중 </ul>;
  } else if (mydata.Autocontrolid == 0) {
    if (isonlystatus == true) {
      ismanual = <ul>수동제어</ul>;
    } else {
      ismanual = (
        <ul>
          <button onClick={() => manualonoff(mydata.Channel, true)}>수동 On</button> <button onClick={() => manualonoff(mydata.Channel, false)}>수동 Off</button>
        </ul>
      );
    }
  } else {
    ismanual = <ul>자동제어중 </ul>;
  }

  return (
    <div className="outputbox">
      <ul>{mydata.Name}</ul>
      <ul>{mydata.Status} </ul>
      {ismanual}
    </div>
  );
}

function Outputdevicedisplay(updateintervalmsec,isonlystatus) {
  console.log("Outputdevicedisplay 01");

  const [moutdevarray, setUpdate] = useState([]);

  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      IndoorFarmAPI.getoutputstatus().then((devices) => {
        setUpdate(devices);
      });
    }, updateintervalmsec);

    return () => clearInterval(interval);
  }, [moutdevarray]);

  return (
    <div className="outputtable">
      <h1>output display</h1>
      {moutdevarray.map((localState, index) => outputdevbox(localState, isonlystatus))}
    </div>
  );
}

export default Outputdevicedisplay;
