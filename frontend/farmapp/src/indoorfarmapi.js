import reqMessage from "./reqMessage";

import Sensordevice from "./commonjs/sensordevice";
import Outputdevice from "./commonjs/outputdevice";
import AutoControl from "./commonjs/autocontrol";
import responseMessage from "./commonjs/responseMessage";
import myGlobalvalues from "./myGlobal";
import KDCommon from "./commonjs/kdcommon";

import firebase from "./firebase.js";
let database = firebase.database();
let frrequest = database.ref("Sensors/request/message");
let frresponse = database.ref("Sensors/response/message");

let resposemsg;

const API = "/api/";

export default class IndoorFarmAPI {
  constructor(islocal) {
    this.islocal = islocal;
    if (this.islocal === false) {
      frresponse.on("value", (snapshot) => {
        const data = snapshot.val();

        resposemsg = JSON.parse(data);
        //  console.log("resposemsg ...event...");

        //console.log(resposemsg);
      });
    }
  }

  async postData(url = "", data = {}) {
    let response;

    if (this.islocal === false) {
      resposemsg = null;
      frrequest.set(JSON.stringify(data));
      //5초 동안 응답기다림.
      for (let i = 0; i < 50; i++) {
        await KDCommon.delay(100);
        if (resposemsg != null) {
          //    console.log("resposemsg");
          return resposemsg;
        }
      }
    } else {
      response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data), //
      });
    }

    return response.json();
  }

  async getsensordatas() {
    const resdata = await this.getRequest(true, false, false, false);
    if (resdata) {
      return resdata.Sensors;
    }
    return null;
  }

  async getoutputstatus() {
    const resdata = await this.getRequest(false, true, false, false);
    if (resdata) {
      return resdata.Outputs;
    }
    return null;
  }
  async getautocontrols() {
    return await this.getRequest(true, true, true, true);
  }

  // 서버에 데이터 저장 요청
  async setRequest(mReqmsg) {
    let resdata ;

    try {
       resdata = await this.postData(API + "farmrequest", mReqmsg);

      console.log(" setRequest rsp : " + resdata.IsOK);
      
    } catch (error) {
      console.log(" setRequest error : " + error);
    } finally {
      console.log(" setRequest finally  : " );
      return resdata  ;
      
    }
  }

  //서버에 상태및 정보 요청
  async getRequest(isensor, isoutdev, isautostate, isautocontrol) {
    let mrepmsg = new responseMessage();

    try {
      const reqmsg = new reqMessage("IF9987");
      //자동제어  센서목록, 출력목록 다 가져옴
      reqmsg.getAutoControlstate = isautostate;
      reqmsg.getSensors = isensor;
      reqmsg.getOutputport = isoutdev;
      reqmsg.getAutoControl = isautocontrol;

      const resdata = await this.postData(API + "farmrequest", reqmsg);

      resdata.AutoControls.forEach((element) => {
        mrepmsg.AutoControls.push(AutoControl.Clonbyjsonobj(element));
      });

      resdata.Sensors.forEach((element) => {
        mrepmsg.Sensors.push(Sensordevice.Clonbyjsonobj(element));
      });

      resdata.Outputs.forEach((element) => {
        mrepmsg.Outputs.push(Outputdevice.Clonbyjsonobj(element));
      });
    } catch (error) {
      console.log(" getRequest error : " + error);
    } finally {
      //console.log(" getRequest finally  : " + mrepmsg);
      return mrepmsg;
    }
  }

  async setmanualonoff(moutputport) {
    const reqmsg = new reqMessage("IF9987");

    reqmsg.OutputManual=[];
    reqmsg.OutputManual.push(moutputport);

    return await this.setRequest(reqmsg);
  }

  async setAutocontrolsetup(mAutocfg) {
    const reqmsg = new reqMessage("IF9987");

    reqmsg.Autoconfigitem = mAutocfg;

    return await this.setRequest(reqmsg);
  }

  async setDeviceconfigsetup(mDevcfg) {
    const reqmsg = new reqMessage("IF9987");

    reqmsg.Deviceconfigitem = mDevcfg;

    return await this.setRequest(reqmsg);
  }

  async setLogin(id, pw) {
    const reqmsg = new reqMessage("IF9987");

    reqmsg.loginID = id;
    reqmsg.loginPW = pw;

    return await this.setRequest(reqmsg);
  }

}
