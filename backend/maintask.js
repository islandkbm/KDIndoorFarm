const KDCommon = require("../frontend/farmapp/src/commonjs/kdcommon");

const ModbusRTU = require("modbus-serial");
const ModbusComm = new ModbusRTU();
const SensorNode = require("./sensornode.js");
const ActuatorNode = require("./actuatornode.js");

const AutoControl = require("./autocontrol.js");

var istaskStopByerror = false;
var outputOnoffstring = "000000000000000000000000";

var mSensors = [];
var mAutolist = [];

function postapi(req, rsp) {
  let reqmsg = JSON.parse(JSON.stringify(req.body));
  if (reqmsg.getSensors === true) {
    rsp.send(JSON.stringify(mSensors));
  } else if (reqmsg.setManualControl === true) {
    console.log("setManualControl   " + reqmsg.OutputManual.length);
    for (let mctl of reqmsg.OutputManual) {
      setOutput(mctl.hardwareChannel, mctl.isonoff);
    }
    

    console.log("setManualControl outputOnoffstring:   " + outputOnoffstring);
    rsp.send("OK");
  } else {
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
      await ModbusComm.setTimeout(1000);

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
  let nodeindex = 0;
  const myactuator = new ActuatorNode(1, modbuscomm);
  const mysnode_sid_11 = new SensorNode(11, modbuscomm);
  const mysnode_sid_12 = new SensorNode(12, modbuscomm);
  let mss = [];
  const sensornodes = [mysnode_sid_11, mysnode_sid_12];
  let mtask_count = 0;

  try {
    while (true) {
      ///
      //    console.log("modbusTask start: " + sec_count);
      if (istaskStopByerror == true) {
        return "modbusTask";
      }

      ///출력상태가 변경되면 출력변경함.
      if (isoutputchange(outputOnoffstring, last_actuator_status) == true ) {
        console.log("set outputOnoffstring ====:   " + outputOnoffstring);

        //상태를 변경시키고 바로 상태를 읽어온다.
        await myactuator.ControlOnOffString(outputOnoffstring);
        
        console.log("myactuator status  write: " + outputOnoffstring + " ,read: " + last_actuator_status);
        await KDCommon.delay(300);
      }

      let retst = await myactuator.ReadStatusString();
          if (retst) {
            last_actuator_status = retst;
            console.log("myactuator status : " + last_actuator_status);
          }
          await KDCommon.delay(300);



      sec_count++;
      
     
       
          

          if (nodeindex >= sensornodes.length) {
            console.log("===============================sensro read end: " + mss.length);
            //센서값을 읽어온후 한꺼번에 배열에 집어넣는다.
            mSensors = [];
            mSensors.push(...mss);
            mss = [];
            nodeindex = 0;
          }
          const snode = sensornodes[nodeindex];
          if (snode) {
            let sensorlist = await snode.ReadSensorAll();
            if (sensorlist) {
              mss.push(...sensorlist);
            }
          }

          nodeindex++;
      await KDCommon.delay(300);

      console.log("modbusTask end: " + mtask_count);
      mtask_count++;
    }
  } catch (error) {
    console.log("modbusTask : catch...... ");
    istaskStopByerror = true;
    throw error;
  }

  return "modbusTask";
}

async function controltask() {
  let sec_count = 0;

  mAutolist.push(new AutoControl(0, 86000, 1));
  mAutolist.push(new AutoControl(0, 86000, 4));

  let m3s = new AutoControl(0, 86000, 0);
  m3s.pwmontime = 3;
  m3s.pwmofftime = 3;
  mAutolist.push(m3s);

  let m4s = new AutoControl(0, 86000, 2);
  m4s.pwmontime = 2;
  m4s.pwmofftime = 4;
  mAutolist.push(m4s);

  try {
    while (true) {
      await KDCommon.delay(1000);
      console.log("controltask end: " + sec_count++);

      const clocknow = new Date();
      const totalsec = clocknow.getHours() * 3600 + clocknow.getMinutes() * 60 + clocknow.getSeconds();
      for (const ma of mAutolist) {
        if (ma.controlcheckbytime(totalsec) === true) {
          //outputstatetrigger = true;
        }
        setOutput(ma.hwchannel, ma.myonoffstate);
        //  console.log("controltask name: " + ma.myonoffstate);
      }
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
