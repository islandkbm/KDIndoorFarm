
import reqMessage from "./reqMessage";


import Sensordevice from "./commonjs/sensordevice";
import Outputdevice from "./commonjs/outputdevice";
import AutoControl from "./commonjs/autocontrol";
import responseMessage from "./commonjs/responseMessage";


const API = "/api/";

export default class IndoorFarmAPI {
  abc = "123";
  def = "456";

  static logout(mobj) {
    console.log("IndoorFarmAPI ");
    return "logout";
  }

  static async postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached

      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },

      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response; // parses JSON response into native JavaScript objects
  }

  static async getsensordatas() {
    var mlist = [];

    try {
      const reqmsg = new reqMessage();
      reqmsg.getSensors = true;

      
      const res = await IndoorFarmAPI.postData(API + "farmrequest", reqmsg);
      const resdata = await res.json();
      

      resdata.Sensors.forEach((element) => {
        mlist.push(Sensordevice.Clonbyjsonobj(element));
      });
    } catch (error) {
      console.log(" getsensordata error : " + error);
    } finally {
      console.log(" getsensordata finally  : " + mlist.length);
      return mlist;
    }
  }

  static async getmultiple(isensor,isoutdev, isautostate) {
    
    let mrepmsg = new responseMessage();


    try {
      const reqmsg = new reqMessage();
      //자동제어  센서목록, 출력목록 다 가져옴
      reqmsg.getAutoControlstate = isautostate;
      reqmsg.getSensors = isensor;
      reqmsg.getOutputport = isoutdev;

      
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
      console.log(" getmultiple error : " + error);
    } finally {
      console.log(" getmultiple finally  : " + mrepmsg);
      return mrepmsg;
    }
  }

  static async getautocontrols() {
    
    let mrepmsg = new responseMessage();


    try {
      const reqmsg = new reqMessage();
      //자동제어  센서목록, 출력목록 다 가져옴
      reqmsg.getAutoControl = true;
      reqmsg.getSensors = true;
      reqmsg.getOutputport = true;

      
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
      console.log(" getautocontrols error : " + error);
    } finally {
      console.log(" getautocontrols finally  : " + mrepmsg.AutoControls.length);
      return mrepmsg;
    }
  }
  
  static async getoutputstatus() {
    var mlist = [];

    try {
      const reqmsg = new reqMessage();
      reqmsg.getOutputport = true;

      
      const res = await IndoorFarmAPI.postData(API + "farmrequest", reqmsg);
      const resdata = await res.json();
      resdata.Outputs.forEach((element) => {
        mlist.push(Outputdevice.Clonbyjsonobj(element));
      });
    } catch (error) {
      console.log(" getoutputstatus error : " + error);
    } finally {
      console.log(" getoutputstatus finally  : " + mlist.length);
      return mlist;
    }
  }


  static async setmanualonoff(moutputport) {
   
    var mlist = [];

    try {
      const reqmsg = new reqMessage();
      reqmsg.setManualControl = true;
      reqmsg.OutputManual.push(moutputport);

      
      const res = await IndoorFarmAPI.postData(API + "farmrequest", reqmsg);
      const resdata = await res.json();
      console.log(" setmanualonoff rsp : " + resdata.IsOK);

    } catch (error) {
      console.log(" setmanualonoff error : " + error);
    } finally {
      console.log(" setmanualonoff finally  : " + mlist.length);
      return mlist;
    }

  }
  
  
  static async setAutocontrolsetup(mAutocfg) {
   
    var isok =false;

    try {
      const reqmsg = new reqMessage();
      reqmsg.setAutocontrol = true;
      reqmsg.Autoconfigitem = mAutocfg;
      
      const res = await IndoorFarmAPI.postData(API + "farmrequest", reqmsg);
      const resdata = await res.json();
      console.log(" setAutocontrolsetup rsp : " + resdata.IsOK);
      isok=true;

    } catch (error) {
      console.log(" setAutocontrolsetup error : " + error);
    } finally {
      console.log(" setAutocontrolsetup finally  : " + isok);
      return isok;
    }

  }
  



}
