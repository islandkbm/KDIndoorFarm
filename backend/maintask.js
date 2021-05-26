const fs = require('fs');

const KDCommon = require("../frontend/farmapp/src/commonjs/kdcommon");

const ModbusRTU = require("modbus-serial");
const ModbusComm = new ModbusRTU();
const SensorNode = require("./sensornode.js");
const ActuatorNode = require("./actuatornode.js");
const AutoControl = require("./autocontrol.js");
const Outputdevice = require("../frontend/farmapp/src/commonjs/outputdevice.js");
const Sensordevice = require("../frontend/farmapp/src/commonjs/sensordevice.js");
const responseMessage = require("../frontend/farmapp/src/commonjs/responseMessage");

var istaskStopByerror = false;
var outputOnoffstring = "000000000000000000000000";

var mOutDevices = []; //출력포트 정보및 상태
var mSensors = []; //센서정보
var mAutolist = []; //자동제어
var mOutputonoff = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 릴레이상태 0:off, 1:on 2:local

function postapi(req, rsp) {
  let rspmsg = new responseMessage();

  let reqmsg = JSON.parse(JSON.stringify(req.body));

  if (reqmsg.getSensors === true) {
    rspmsg.Sensors.push(...mSensors);
  } else if (reqmsg.getOutputport === true) {
    rspmsg.Outputs.push(...mOutDevices);
    // rsp.send(JSON.stringify(mOutDevices));
  } else if (reqmsg.setManualControl === true) {
    if (reqmsg.OutputManual) {
      console.log("setManualControl   " + reqmsg.OutputManual.length);
      for (let mctl of reqmsg.OutputManual) {
        setOutput(mctl.hardwareChannel, mctl.isonoff);
      }
      outputOnoffstring = updateOutputstate();

      console.log("setManualControl outputOnoffstring:   " + outputOnoffstring);
      rspmsg.IsOK = true;
    }
  } else {
    rspmsg.IsOK = false;
  }

  rsp.send(JSON.stringify(rspmsg));
}

async function maintask() {
  let maincount = 0;
  istaskStopByerror = false;
  console.log("------------main start-------------------");

  try {
    if (ModbusComm.isOpen == false) {
      var mconn = ModbusComm.connectRTUBuffered("COM19", {
        baudRate: 115200,
        stopBits: 1,
        dataBits: 8,
        parity: "none",
        flowControl: false,
      });

      var mmm = await mconn;
      console.info("connect comport : " + ModbusComm.isOpen);
    }
    if (ModbusComm.isOpen == true) {
      await ModbusComm.setTimeout(400);
      const promisearray = [modbusTask(ModbusComm), controltask()];
      await Promise.all(promisearray);
    }

    console.log("------------main stop -------------------");
  } catch (error) {
    istaskStopByerror = true;
    console.error("maintask error : " + error.toString());
  } finally {
    console.log("------------main stop by error-------------------");

    setTimeout(maintask, 1000);
  }
}

function setOutput(hwchannel, onoff) {
  let channel_num = parseInt(hwchannel);
  if (channel_num >= 0 && channel_num < 24) {
    if (onoff === true) {
      mOutputonoff[channel_num] = 1;
    } else {
      mOutputonoff[channel_num] = 0;
    }
  }
}

function updateOutputstate() {
  let retstring = "";

  for (let i = 0; i < 24; i++) {
    if (mOutputonoff[i] === 1) {
      retstring += "1";
    } else {
      retstring += "0";
    }
  }

  return retstring;
}

function isoutputchange(newstate, laststatus) {
  if (newstate.length === 24 && laststatus.length === 24) {
    for (let chi = 0; chi < 24; chi++) {
      let newonoff = newstate.charAt(chi);
      let lastonoff = laststatus.charAt(chi);
      //현장제어는 상태를 비교하지않음
      if (lastonoff != "2") {
        if (newonoff != lastonoff) {
          return true;
        }
      }
    }
  }
  return false;
}

//센서상태를 업데이트함.
function sensorupdate(newsensorlist) {
  //업데이트 할때마다 에러카운트 증가
  for (const ms of mSensors) {
    ms.errorcount++;
  }

  for (const newsensor of newsensorlist) {
    let isnew = true;
    for (const oldsensor of mSensors) {
      if (oldsensor.UniqID === newsensor.UniqID) {
        console.log("sensorupdate  : " + newsensor.UniqID + " name : " + newsensor.Name + " value : " + newsensor.valuestring);

        oldsensor.value = newsensor.value;
        oldsensor.status = newsensor.status;
        oldsensor.valuestring = newsensor.valuestring;
        oldsensor.errorcount = 0;
        isnew = false;
        break;
      }
    }

    if (isnew === true) {
      mSensors.push(newsensor);
    }
  }
}

async function modbusTask(modbuscomm) {
  let last_actuator_status = "000000000000000000000000";

  const myactuator = new ActuatorNode(1, modbuscomm);
  const mysnode_sid_11 = new SensorNode(11, modbuscomm);
  const mysnode_sid_12 = new SensorNode(12, modbuscomm);
  let mss = [];
  const sensornodes = [mysnode_sid_11, mysnode_sid_12];
  let mtask_count = 0;
  let stateindex = 0;
  let isoutput_update = false;

  try {
    while (true) {
      if (istaskStopByerror == true) {
        return "modbusTask";
      }

      ///출력상태가 변경되면 출력변경함.
      if (isoutputchange(outputOnoffstring, last_actuator_status) == true && isoutput_update == false) {
        console.log("set myactuator status  write: " + outputOnoffstring + " ,last: " + last_actuator_status);

        //상태를 변경시키고 바로 상태를 읽어온다.
        await myactuator.ControlOnOffString(outputOnoffstring);
        isoutput_update = true;
        stateindex = 0;
      }

      switch (stateindex) {
        case 0:
          {
            let retst = await myactuator.ReadStatusString();
            if (retst) {
              last_actuator_status = retst;

              isoutput_update = false;
              outputstatusupdate(mOutDevices, last_actuator_status);
              // await KDCommon.delay(100);

              console.log("myactuator status : " + last_actuator_status);
            }
          }

          break;
        case 2:
          mss = [];
          {
            let sensorlist = await mysnode_sid_11.ReadSensorAll();
            if (sensorlist) {
              mss.push(...sensorlist);
            }
          }
          break;

        case 3:
          {
            let sensorlist = await mysnode_sid_12.ReadSensorAll();
            if (sensorlist) {
              mss.push(...sensorlist);
            }

            sensorupdate(mss);
            //mSensors = [];
            //mSensors.push(...mss);
          }
          break;
      }

      stateindex++;
      if (stateindex >= 4) {
        stateindex = 0;
      }

      await KDCommon.delay(300);

      //  console.log("modbusTask end: " + mtask_count);
      mtask_count++;
    }
  } catch (error) {
    console.log("modbusTask : catch...... ");
    istaskStopByerror = true;
    throw error;
  }

  return "modbusTask";
}

function outputstatusupdate(outdevlist, onoffstring) {
  for (let outdev of outdevlist) {
    let status = onoffstring.charAt(outdev.Channel);
    if (status == "0") {
      outdev.Status = Outputdevice.OPStatus.OPS_Off;
    } else if (status == "1") {
      outdev.Status = Outputdevice.OPStatus.OPS_On;
    } else if (status == "2") {
      outdev.Status = Outputdevice.OPStatus.OPS_Local;
    }
  }
}

async function controltask() {

const outdevicefilename= 'indoorfarmoutputdevicelist.json';
const autofilename= 'indoorfarmautocontollist.json';

  let sec_count = 0;

  /*
  let m3s = new AutoControl(0, 86000, 0);
  m3s.pwmontime = 3;
  m3s.pwmofftime = 3;
  mAutolist.push(m3s);

  let m4s = new AutoControl(0, 86000, 2);
  m4s.pwmontime = 2;
  m4s.pwmofftime = 4;
  mAutolist.push(m4s);
*/
/*
  mOutDevices = [];
  let mout1 = new Outputdevice(0, "메인펌프", 0, Outputdevice.OutDeviceTypeEnum.ODT_VALVE);
  let mout2 = new Outputdevice(1, "환기팬", 1, Outputdevice.OutDeviceTypeEnum.ODT_FAN);
  let mout3 = new Outputdevice(2, "분무밸브", 2, Outputdevice.OutDeviceTypeEnum.ODT_VALVE);
  let mout4 = new Outputdevice(3, "난방", 3, Outputdevice.OutDeviceTypeEnum.ODT_HEATER);
  let mout5 = new Outputdevice(4, "냉방", 4, Outputdevice.OutDeviceTypeEnum.ODT_COOLER);

  mOutDevices.push(mout1);
  mOutDevices.push(mout2);
  mOutDevices.push(mout3);
  mOutDevices.push(mout4);
  mOutDevices.push(mout5);

  Outputdevice.Writefile(outdevicefilename,mOutDevices);
*/


/*
  let a1dlist = [];
  let a2dlist = [];
  let a3dlist = [];
  a1dlist.push(mout1.UniqID);

  a1dlist.push(mout3.UniqID);
  a2dlist.push(mout4.UniqID);
  a3dlist.push(mout5.UniqID);

  mAutolist.push(new AutoControl(0, 86000, a1dlist));
  mAutolist.push(new AutoControl(0, 86000, a2dlist));

  let ma3 = new AutoControl(0, 86000, a3dlist);
  ma3.istimer = false;
  ma3.pwmcontrolenable = false;
  ma3.sensorid = "S11C513";
  ma3.onvalue = 30;
  ma3.offvalue = 29;
  ma3.condition = "up";

  mAutolist.push(ma3);
  console.log("ma3 uid: " + ma3.uniqid);
  mAutolist[0].enabled=true;


  AutoControl.Writefile(autofilename,mAutolist);
*/

  mOutDevices = Outputdevice.Readfile(outdevicefilename);
  mAutolist = AutoControl.Readfile(autofilename);

  


  try {
    while (true) {
      await KDCommon.delay(1000);
      //console.log("controltask end: " + sec_count++ + " mde = " + mde);

      const clocknow = new Date();
      const totalsec = clocknow.getHours() * 3600 + clocknow.getMinutes() * 60 + clocknow.getSeconds();

      for (const ma of mAutolist) {
        if (ma.enabled === true) {
          ma.controlcheckbytime(mSensors, totalsec);

          for (const mdevid of ma.devids) {
            for (let mdev of mOutDevices) {
              if (mdev.UniqID === mdevid) {
                setOutput(mdev.Channel, ma.myonoffstate);
                mdev.Autocontrolid = ma.uniqid;
              }
            }
          }
        }
      }

      outputOnoffstring = updateOutputstate();
    }
  } catch (error) {
    console.log("controltask : catch...... ");
    istaskStopByerror = true;
    throw error;
  }

  return "controltask";
}

exports.postapi = postapi;
exports.maintask = maintask;
