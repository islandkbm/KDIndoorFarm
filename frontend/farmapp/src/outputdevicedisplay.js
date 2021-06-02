import React from "react";
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
  let ismanual = "자동제어중";
  let devicon = "./image/devicon_" + mydata.DevType + ".png";
  let onofficon = "./image/" + mydata.Status + ".png";

  if (mydata.Status === Outputdevice.OPStatus.OPS_Local) {
    ismanual = "현장제어중";
  } else if (mydata.Autocontrolid == 0) {
    if (isonlystatus == true) {
      ismanual = "수동제어";
    } else {
      ismanual = (
        <div>
          <button className="button_on" onClick={() => manualonoff(mydata.Channel, true)}>수동 On</button> <button className="button_off"  onClick={() => manualonoff(mydata.Channel, false)}>수동 Off</button>
        </div>
      );
    }
  }

  return (
    <div className="out_con">
      <div className="out_name">
        <img src={devicon} className="icon" />   {mydata.Name}
      </div>
      <div className="out_value">
        <img src={onofficon} className="onoff" />
      </div>
      <div className="out_result">{ismanual}</div>
    </div>
  );
}

function Outputdevicedisplay(moutdevarray, isonlystatus) {
  return (
    <div className="output">
      <div className="out_title">OUTPUT DISPLAY</div>
      <div className="out">
        {moutdevarray.map((localState, index) => outputdevbox(localState, isonlystatus))}
       </div>
    </div>
  );
}

export default Outputdevicedisplay;
