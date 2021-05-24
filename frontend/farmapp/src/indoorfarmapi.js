
import reqMessage from "./reqMessage";


import Sensordevice from "./commonjs/sensordevice";



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

      
      const res = await IndoorFarmAPI.postData(API + "getsensorstatus", reqmsg);
      const resdata = await res.json();
      

      resdata.forEach((element) => {
        mlist.push(Sensordevice.Clonbyjsonobj(element));
      });
    } catch (error) {
      console.log(" getsensordata error : " + error);
    } finally {
      console.log(" getsensordata finally  : " + mlist.length);
      return mlist;
    }
  }

  static async setmanualonoff(moutputport) {
   
    var mlist = [];

    try {
      const reqmsg = new reqMessage();
      reqmsg.setManualControl = true;
      reqmsg.OutputManual.push(moutputport);

      
      const res = await IndoorFarmAPI.postData(API + "getsensorstatus", reqmsg);
      const resdata = await res.json();
      resdata.forEach((element) => {
        mlist.push(Sensordevice.Clonbyjsonobj(element));
      });
    } catch (error) {
      console.log(" getsensordata error : " + error);
    } finally {
      console.log(" getsensordata finally  : " + mlist.length);
      return mlist;
    }

  }
}
