const Sensordevice = require("../frontend/farmapp/src/commonjs/sensordevice.js");

const KDCommon = require("../frontend/farmapp/src/commonjs/kdcommon");

module.exports = class SensorNode {
  constructor(slaveid, mmaster) {
    this.NodeName = "nuknown";
    this.DefaultTimeoutmsec = 300;
    this.SlaveID = slaveid;
    this.modbusMaster = mmaster;
    this.SensorCodes = [];
  }
  async CheckmySlaveID(timeoutmsec) {
    if (this.modbusMaster.getTimeout() != timeoutmsec) {
      await this.modbusMaster.setTimeout(timeoutmsec);
    }

    if (this.modbusMaster.getID() != this.SlaveID) {
      await this.modbusMaster.setID(this.SlaveID);
      await KDCommon.delay(300);
    }
  }

  async ReadSensor(sensorcode) {
    try {
      await this.CheckmySlaveID(this.DefaultTimeoutmsec);

      let sensorchannel = (sensorcode >> 8) & 0xff;
      let sensortype = sensorcode & 0xff;
      let regaddress = 301 + sensorchannel * 200 + sensortype * 3;
      if (regaddress > 300 && regaddress < 1100) {
        let rv1 = await this.modbusMaster.readHoldingRegisters(regaddress, 3);
        if (rv1 != undefined) {
          //                console.log("ReadSensor : " + rv1.data.toString()  );
          let sensorvalue = Buffer.from([(rv1.data[0] >> 0) & 0xff, (rv1.data[0] >> 8) & 0xff, (rv1.data[1] >> 0) & 0xff, (rv1.data[1] >> 8) & 0xff]).readFloatLE(0);
          let sensorstatus = rv1.data[2];
          let sv = new Sensordevice(this.SlaveID, sensorcode, sensorvalue, sensorstatus);

          return sv;
        } else {
          console.log("ReadSensor fail : " + regaddress);
        }
      }

      return null;
    } catch (e) {
      console.log("ReadSensor error : " + { e });
      return null;
    }
  }

   readRS485Registers(Regaddress, Reglength)
  {
    return new Promise((resolve, reject) => {
       this.modbusMaster.writeFC3(this.SlaveID, Regaddress,Reglength, function(err,data){
          resolve(data) ;
      } );
      
  });
   

  }


  async ReadSensorAll() {
    try {


      await this.modbusMaster.setTimeout(this.DefaultTimeoutmsec );

      const sensorreadcount = 20;
      let regaddress = 40;
      const  rv1 = await this.readRS485Registers(regaddress, sensorreadcount * 3); //this.modbusMaster.readHoldingRegisters(regaddress, sensorreadcount * 3);
      let svlist = [];
      if (rv1 != undefined) {
        for (let i = 0; i < sensorreadcount; i++) {
          let sv_float = Buffer.from([(rv1.data[i * 3 + 0] >> 0) & 0xff, (rv1.data[i * 3 + 0] >> 8) & 0xff, (rv1.data[i * 3 + 1] >> 0) & 0xff, (rv1.data[i * 3 + 1] >> 8) & 0xff]).readFloatLE(0);
          let sensorcode = rv1.data[i * 3 + 2];
          let sensorstatus = 0;
          if (sensorcode != 0) {
            let sv = new Sensordevice(this.SlaveID, sensorcode, sv_float, sensorstatus);
            svlist.push(sv);
          }
        }

        return svlist;
      } else {
        console.log("ReadSensor fail : " + this.SlaveID);
      }

      return null;
    } catch (Err) {
      console.log(Err);
      return null;
    }
  }

  async ReadInfo() {
    try {
      await this.CheckmySlaveID(this.DefaultTimeoutmsec);
      return await this.modbusMaster.readHoldingRegisters(0, 8);
    } catch (error) {
      return null;
    }
  }

  //연결된 센서 코드 읽어온다. 최대 20개
  async ReadCodes() {
    try {
      await this.CheckmySlaveID(this.DefaultTimeoutmsec);

      let regaddress = 101;

      let rv1 = await this.modbusMaster.readHoldingRegisters(regaddress, 20);
      if (rv1 != undefined) {
        //debug log
        //clear
        this.SensorCodes = [];
        for (const scode of rv1.data) {
          if (scode != 0) {
            this.SensorCodes.push(scode);
            let sch = (scode >> 8) & 0xff;
            let stype = (scode >> 0) & 0xff;
            if (stype > 0) {
              console.log("ReadCodes channel : " + sch + ", type : " + stype);
            }
          }
        }

        return this.SensorCodes;
      } else {
        console.log("ReadCodes error : " + this.SlaveID);
      }

      return null;
    } catch (e) {
      return null;
    }
  }
};
