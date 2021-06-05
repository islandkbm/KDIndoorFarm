import reqMessage from "./reqMessage";

import Sensordevice from "./commonjs/sensordevice";
import Outputdevice from "./commonjs/outputdevice";
import AutoControl from "./commonjs/autocontrol";
import responseMessage from "./commonjs/responseMessage";

const API = "/api/";

export default class IndoorFarmAPI {

  static async postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data), // 
    });
    return response; 
  }

  static async getsensordatas() {
    const resdata = await this.getRequest(true, false, false, false);
    if (resdata) {
      return resdata.Sensors;
    }
    return null;
  }

  static async getoutputstatus() {
    const resdata = await this.getRequest(false, true, false, false);
    if (resdata) {
      return resdata.Outputs;
    }
    return null;
  }
  static async getautocontrols() {
    return await this.getRequest(true, true, true, true);
  }

  // 서버에 데이터 저장 요청
  static async setRequest(mItems, isautocfg, isdevcofig, ismanual) {
    let isok = false;

    console.log(" setDeviceconfigsetup rsp : " + isok);
    try {
      const reqmsg = new reqMessage();
      reqmsg.setDeviceconfig = isdevcofig;
      reqmsg.Deviceconfigitem = mItems;
      reqmsg.setAutocontrol = isautocfg;
      reqmsg.Autoconfigitem = mItems;
      reqmsg.setManualControl = ismanual;
      reqmsg.OutputManual.push(mItems);

      const res = await IndoorFarmAPI.postData(API + "farmrequest", reqmsg);
      const resdata = await res.json();
      console.log(" setRequest rsp : " + resdata.IsOK);
      isok = true;
    } catch (error) {
      console.log(" setRequest error : " + error);
    } finally {
      console.log(" setRequest finally  : " + isok);
      return isok;
    }
  }

  //서버에 상태및 정보 요청
  static async getRequest(isensor, isoutdev, isautostate, isautocontrol) {
    let mrepmsg = new responseMessage();

    try {
      const reqmsg = new reqMessage();
      //자동제어  센서목록, 출력목록 다 가져옴
      reqmsg.getAutoControlstate = isautostate;
      reqmsg.getSensors = isensor;
      reqmsg.getOutputport = isoutdev;
      reqmsg.getAutoControl = isautocontrol;

      const res = await IndoorFarmAPI.postData(API + "farmrequest", reqmsg);
      const resdata = await res.json();

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
      console.log(" getRequest finally  : " + mrepmsg);
      return mrepmsg;
    }
  }

  static async setmanualonoff(moutputport) {
    return await this.setRequest(moutputport, false, false, true);
  }

  static async setAutocontrolsetup(mAutocfg) {
    return await this.setRequest(mAutocfg, true, false, false);
  }

  static async setDeviceconfigsetup(mDevcfg) {
    return await this.setRequest(mDevcfg, false, true, false);
  }
}
