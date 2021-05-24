const KDCommon = require("../frontend/farmapp/src/commonjs/kdcommon");

const ModbusRTU = require("modbus-serial");
const ModbusComm = new ModbusRTU();
const SensorNode = require("./sensornode.js");
const ActuatorNode = require("./actuatornode.js");

var istaskStopByerror = false;
var outputOnoffstring = "000000000000000000000000";
var outputstatetrigger = false;
var mSensors = [];
var mAutolist = [];

function postapi(req, rsp) {


  let reqmsg = JSON.parse(JSON.stringify(req.body));
  if (reqmsg.getSensors === true) {
    rsp.send(JSON.stringify(mSensors));
    
  } 
  else if (reqmsg.setManualControl === true) 
  {
    console.log("setManualControl   " + reqmsg.OutputManual.length);
    for (let mctl of reqmsg.OutputManual) {
      setOutput(mctl.hardwareChannel, mctl.isonoff);
    }
    outputstatetrigger = true;

    console.log("setManualControl outputOnoffstring:   " + outputOnoffstring);
    rsp.send("OK");
  }
  else{

    rsp.send("no data");
  }

  
  
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


String.prototype.replaceAt = function (index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }
  return this.substring(0, index) + replacement + this.substring(index + 1);
};

function setOutput(hwchannel, onoff) {
  let channel_num = parseInt(hwchannel);
  if (channel_num >= 0 && channel_num < 24) {
    if (onoff === true) {
      outputOnoffstring = outputOnoffstring.replaceAt(channel_num, "1");
    } else {
      outputOnoffstring = outputOnoffstring.replaceAt(channel_num, "0");
    }

    //  console.log("setOutput after : " + outputOnoffstring);
  }
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

async function modbusTask(modbuscomm) {
  const sensorscan_interval_sec = 60; // 60초에 한번씩 센서를 스켄함.
  let sec_count = sensorscan_interval_sec;
  let last_actuator_status = "000000000000000000000000";
  const myactuator = new ActuatorNode(1, modbuscomm);
  const mysnode_sid_11 = new SensorNode(11, modbuscomm);
  const mysnode_sid_12 = new SensorNode(12, modbuscomm);

  const sensornodes = [mysnode_sid_11, mysnode_sid_12];

  try {
    while (true) {
      ///
  //    console.log("modbusTask start: " + sec_count);
      if (istaskStopByerror == true) {
        return "modbusTask";
      }

      ///출력상태가 변경되면 출력변경함.
      if (isoutputchange(outputOnoffstring, last_actuator_status) == true || outputstatetrigger === true) {
        console.log("set outputOnoffstring ====:   " + outputOnoffstring);

        //상태를 변경시키고 바로 상태를 읽어온다.
        await myactuator.ControlOnOffString(outputOnoffstring);
        var rstatus = await myactuator.ReadStatusString();
        if (rstatus != null) {
          last_actuator_status = rstatus;
        }

        outputstatetrigger = false;

        console.log("myactuator status  write: " + outputOnoffstring + " ,read: " + last_actuator_status);
      }

      sec_count++;

      if (outputstatetrigger === true) {
        console.log("=======================contine333............");
        continue;
      }
      if (sec_count >= sensorscan_interval_sec) {
        for (const snode of sensornodes) {
          //     await snode.ReadCodes();
        }
        sec_count = 0;
      } else {
        //2초에 한번씩 읽음
        if (sec_count % 2 == 1) {
          last_actuator_status = await myactuator.ReadStatusString();
          console.log("myactuator status : " + last_actuator_status);
        } else {
          let mss = [];
          for (const snode of sensornodes) {
            if (outputstatetrigger === true) {
              console.log("=======================contine............");
              continue;
            }
            let sensorlist = await snode.ReadSensorAll();
            if (sensorlist) {
              mss.push(...sensorlist);
            }
          }
          console.log("===============================sensro read end: " + mss.length);

          if (outputstatetrigger === true) {
            console.log("=======================contine 444............");
            continue;
          }

          //센서값을 읽어온후 한꺼번에 배열에 집어넣는다.
          mSensors = [];
          mSensors.push(...mss);
        }
      }

      await KDCommon.delay(1000);
    //  console.log("modbusTask end: " + sec_count);
    }
  } catch (error) {
    console.log("controltask : catch...... ");
    istaskStopByerror = true;
    throw error;
  }

  return "modbusTask";
}

async function controltask() {
  
  let sec_count = 0;

  try {
    while (true) {
      await KDCommon.delay(1000);
      console.log("controltask end: " + sec_count++);
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
