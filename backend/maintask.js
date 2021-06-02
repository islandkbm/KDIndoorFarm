const fs = require('fs');

const KDCommon = require("../frontend/farmapp/src/commonjs/kdcommon");

const ModbusRTU = require("modbus-serial");
const ModbusComm = new ModbusRTU();
const SensorNode = require("./sensornode.js");
const ActuatorNode = require("./actuatornode.js");
const AutoControl = require("../frontend/farmapp/src/commonjs/autocontrol.js");
const AutoControlconfig = require("../frontend/farmapp/src/commonjs/autocontrolconfig");
const Outputdevice = require("../frontend/farmapp/src/commonjs/outputdevice.js");
const Sensordevice = require("../frontend/farmapp/src/commonjs/sensordevice.js");
const responseMessage = require("../frontend/farmapp/src/commonjs/responseMessage");


const outdevicefilename= '../indoorfarmoutputdevicelist.json';
const autofilename= '../indoorfarmautocontollist.json';



var istaskStopByerror = false;
var outputOnoffstring = "000000000000000000000000";

var mOutDevices = []; //출력포트 정보및 상태
var mSensors = []; //센서정보
var mAutolist = []; //자동제어
var mOutputonoff = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 릴레이상태 0:off, 1:on 2:local


function saveautoconfig(mcfgitem)
{
  let mcfglist= AutoControlconfig.Readfile(autofilename);
  let isnew=true;

    for(let i=0;i< mcfglist.length ; i++)
    {
      let mcfg =mcfglist[i];
      if(mcfg.uniqid === mcfgitem.uniqid)
      {
        isnew=false;

        
        //이전출력장비 설정값을 미리 클리어한후 업데이트함.
        setoutputchangebyautocontrol(mcfglist[i],false,true);

        mcfglist[i] = mcfgitem;
        break;

      }
    }
    if(isnew ===true)
    {
      mcfglist.push(mcfgitem);
    }

    AutoControlconfig.Writefile(autofilename,mcfglist );
    Autocontrolload(mcfgitem);



}


function postapi(req, rsp) {
  let rspmsg = new responseMessage();

  let reqmsg = JSON.parse(JSON.stringify(req.body));

  //console.log("---------------------------------postapi :  sensor :"  + reqmsg.getSensors+ " ,getOutputport:  " + reqmsg.getOutputport);


  if (reqmsg.setManualControl === true) {
    if (reqmsg.OutputManual) {
      console.log("setManualControl   " + reqmsg.OutputManual.length);
      for (let mctl of reqmsg.OutputManual) {
        setOutput(mctl.hardwareChannel, mctl.isonoff);
      }
      outputOnoffstring = updateOutputstate();

      console.log("setManualControl outputOnoffstring:   " + outputOnoffstring);
      rspmsg.IsOK = true;
    }
  } else if(reqmsg.setAutocontrol ===true)
  {

    if (reqmsg.Autoconfigitem) {
      let acfg= AutoControlconfig.deepcopy(reqmsg.Autoconfigitem);
      console.log("setAutocontrol id:   " + acfg.uniqid  + ", name :" +acfg.name ) ;
      saveautoconfig(acfg);


    }

    rspmsg.IsOK = true;
  }
  else{

  if (reqmsg.getAutoControl === true) {
    rspmsg.AutoControls.push(...mAutolist);

  }
  if (reqmsg.getSensors === true) {
    rspmsg.Sensors.push(...mSensors);
  } 
  if (reqmsg.getOutputport === true) {
    rspmsg.Outputs.push(...mOutDevices);
    
  } 
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
      await ModbusComm.setTimeout(200);
      const promisearray = [modbusTask(ModbusComm), controltask()];
      await Promise.all(promisearray);
    }

    console.log("------------main stop -------------------");
  } catch (error) {
    istaskStopByerror = true;
    console.error("maintask error : " + error.toString());
  } finally {
    console.log("------------main stop by error-------------------");

    //에러발생시 다시시작
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
      //  console.log("sensorupdate  : " + newsensor.UniqID + " name : " + newsensor.Name + " value : " + newsensor.valuestring);

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
  let isoutput_update = false;
  let modbusTask_count=0;


  try {
    while (true) {
      if (istaskStopByerror == true) {
        return "modbusTask";
      }

      
      ///출력상태가 변경되면 출력변경함.
      if (isoutputchange(outputOnoffstring, last_actuator_status) == true && isoutput_update == false) {
        console.log("set myactuator status  write: " + outputOnoffstring + " ,last: " + last_actuator_status);
        
        await myactuator.ControlOnOffString(outputOnoffstring);
        await KDCommon.delay(300);
        isoutput_update = true;
        stateindex = 0;
      }

      let retst = await myactuator.ReadStatusString();
      if (retst) {
        last_actuator_status = retst;
        isoutput_update = false;
        outputstatusupdate(mOutDevices, last_actuator_status);
        await KDCommon.delay(200);

       // console.log("myactuator status : " + last_actuator_status);
      }


          mss = [];
          for(const snode of sensornodes)
          {
            let sensorlist = await snode.ReadSensorAll();
            if (sensorlist) {
              mss.push(...sensorlist);
            }
            await KDCommon.delay(300);
          }

          
          sensorupdate(mss);

      await KDCommon.delay(200);

      modbusTask_count++;
       console.log("modbusTask end: " + modbusTask_count);
     
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


function Autocontrolload(isonlyoneitem) {

  let mcfglist= AutoControlconfig.Readfile(autofilename);

  ///전체 다시 로드 
  if(isonlyoneitem===null)
  {
    mAutolist=[];
    for(const mcfg of mcfglist)
    {
      mAutolist.push(new AutoControl(mcfg));
    }
  }
  else{ //특정 한개만 다시로드 

    for (let i=0;i<mAutolist.length ; i++ ) {

      let ma =mAutolist[i];
      if( ma.mConfig.uniqid === isonlyoneitem.uniqid)
      {
        mAutolist[i]= new AutoControl(isonlyoneitem);
        console.log("Autocontrolload reload: " + isonlyoneitem.uniqid + ",name : " + ma.mConfig.name);
        return "ok";
      }

    }
//목록에 없으면 새로 만든거임
    mAutolist.push(new AutoControl(isonlyoneitem));


    
  }

}

function setoutputchangebyautocontrol(mautocfg,onoffstate,  isclear)
{
  for (const mdevid of mautocfg.devids) {
    for (let mdev of mOutDevices) {
      if (mdev.UniqID === mdevid) {
        if(isclear ===true)
        {
          setOutput(mdev.Channel, false);
          mdev.Autocontrolid = "";
        }
        else{
          setOutput(mdev.Channel, onoffstate);
          mdev.Autocontrolid = mautocfg.uniqid;
        }
        
      }
    }
  }
}


async function controltask() {


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

let ma1 = new AutoControlconfig();
  ma1.name = "냉방제어";
  ma1.istimer = false;
  ma1.pwmcontrolenable = false;
  ma1.sensorid = "S11C513";
  ma1.onvalue = 27;
  ma1.offvalue = 28;
  ma1.condition = "down";
  ma1.enabled=true;
  ma1.devids.push(0);


  let ma2 = new AutoControlconfig();
  ma2.name = "PWM제어";
  ma2.istimer = false;
  ma2.pwmcontrolenable = true;
  ma2.pwmontime=10;
  ma2.pwmofftime=20;
  ma2.enabled=true;
  ma2.devids.push(1);



  let ma3 = new AutoControlconfig();
  ma3.name = "난방제어";
  ma3.istimer = false;
  ma3.pwmcontrolenable = false;
  ma3.sensorid = "S11C513";
  ma3.onvalue = 30;
  ma3.offvalue = 29;
  ma3.condition = "up";
  ma3.enabled=true;
  ma3.devids.push(3);
  ma3.devids.push(4);
  ma3.devids.push(5);


  let mconfiglist=[];
  mconfiglist.push(ma1);
  mconfiglist.push(ma2);
  mconfiglist.push(ma3);


AutoControlconfig.Writefile(autofilename,mconfiglist);
*/


  mOutDevices = Outputdevice.Readfile(outdevicefilename);

  Autocontrolload(null);

  

  


  try {
    while (true) {
      await KDCommon.delay(1000);
      //console.log("controltask end: " + sec_count++ + " mde = " + mde);

      const clocknow = new Date();
      const totalsec = clocknow.getHours() * 3600 + clocknow.getMinutes() * 60 + clocknow.getSeconds();

      for (const ma of mAutolist) {
      //  console.log("mAutolist name : " + ma.mConfig.name);

        if (ma.ischangebycontrol(mSensors, totalsec) === true) {
          setoutputchangebyautocontrol(ma.mConfig,ma.mState.onoffstate, false);
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
