const KDCommon = require("../frontend/farmapp/src/commonjs/kdcommon");

module.exports = class ActuatorNode {
  constructor(slaveid, mmaster) {
    this.OnOffoperationregstartaddress = 601;
    this.OnOffstatusregstartaddress = 301;
    this.DefaultTimeoutmsec = 1000;

    this.SlaveID = slaveid;
    this.modbusMaster = mmaster;
  }

  async CheckmySlaveID(timeoutmsec) {
    if (this.modbusMaster.getTimeout() != timeoutmsec) {
      await this.modbusMaster.setTimeout(timeoutmsec);
    }
    if (this.modbusMaster.getID() != this.SlaveID) {
      await this.modbusMaster.setID(this.SlaveID);
      await  KDCommon.delay(300);
    }
  }

  async ReadStatus(channel, wopid) {
    try {
      if (channel < 24) {
        await this.CheckmySlaveID(this.DefaultTimeoutmsec);

        let regaddress = this.OnOffstatusregstartaddress + channel * 4;

        let rv1 = await this.modbusMaster.readHoldingRegisters(regaddress, 4);
        if (rv1 != undefined) {
          console.log("ReadStatus : " + rv1.data.toString() + " wopid : " + wopid);
          if (rv1.data[0] == wopid || wopid == undefined) {
            return rv1.data[1];
          }
        }
      }

      return null;
    } catch (e) {
      console.log("ReadStatus error: " + e.toString());
      return null;
    }
  }

  async ReadStatusString() {
    try {
      await this.CheckmySlaveID(this.DefaultTimeoutmsec);

      let regaddress = this.OnOffstatusregstartaddress;

      let rv1 = await this.modbusMaster.readHoldingRegisters(regaddress, 24 * 4);
      if (rv1 != undefined) {
        let retstring = "";

        for (let i = 0; i < 24; i++) {
          if (rv1.data[i * 4 + 1] == 201) {
            retstring += "1";
          } else if (rv1.data[i * 4 + 1] == 299) {
            //현장제어중
            retstring += "2";
          } else {
            retstring += "0";
          }
        }

        return retstring;
      }

      return null;
    } catch (e) {}
  }

  async ControlTimed(channel, ontimesec) {
    try {
      await this.CheckmySlaveID(this.DefaultTimeoutmsec);

      let regaddress = this.OnOffoperationregstartaddress + channel * 4;
      let regdatas = Array();

      regdatas[0] = 202;
      regdatas[1] = 202 + channel * 1000;
      regdatas[2] = ontimesec & 0xffff;
      regdatas[3] = (ontimesec >> 16) & 0xffff;
      let rv1 = await this.modbusMaster.writeRegisters(regaddress, regdatas);

      if (rv1 != undefined) {
        let rstatus = await this.ReadStatus(channel, regdatas[1]);

        return rstatus;
      }

      return null;
    } catch (e) {}
  }

  async ControlOnOffString(stringonoff) {
    try {
      let regaddress = this.OnOffoperationregstartaddress;
      let regdatas = Array();

      await this.CheckmySlaveID(this.DefaultTimeoutmsec);

      let chlength = stringonoff.length;

      if (chlength <= 0 || chlength > 24) {
        return false;
      }
      for (let chi = 0; chi < chlength; chi++) {
        let onoffs = stringonoff.charAt(chi);
        if (onoffs == "0") {
          regdatas[chi * 4 + 0] = 0;
        } else {
          regdatas[chi * 4 + 0] = 201;
        }

        regdatas[chi * 4 + 1] = 202 + chi * 1000;
        regdatas[chi * 4 + 2] = 0;
        regdatas[chi * 4 + 3] = 0;
      }
      let rv1 = await this.modbusMaster.writeRegisters(regaddress, regdatas);

      if (rv1 != undefined) {
        return true;
      }
      return null;
    } catch (e) {}
  }
};
