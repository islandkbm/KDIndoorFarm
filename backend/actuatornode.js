const RangeParser = require("range-parser");
const KDCommon = require("../frontend/farmapp/src/commonjs/kdcommon");

module.exports = class ActuatorNode {
  constructor(slaveid, mmaster) {
    this.OnOffoperationregstartaddress = 601;
    this.OnOffstatusregstartaddress = 301;
    this.DefaultTimeoutmsec = 200;

    this.SlaveID = slaveid;
    this.modbusMaster = mmaster;

    this.node_error_count=0;
    this.node_is_disconnect=true;
    this.node_product_code=0;

  }
  
   readRS485Registers(Regaddress, Reglength)
  {
    return new Promise((resolve, reject) => {
      this.modbusMaster.writeFC3(this.SlaveID, Regaddress,Reglength, function(err,data){
          resolve(data) ;
          if(err)
          {
            console.log(err);
          }

      } );
      
  });
  }

  
  writeRS485Registers(Regaddress, RegDatas)
  {
    return new Promise((resolve, reject) => {
      this.modbusMaster.writeFC16(this.SlaveID, Regaddress,RegDatas, function(err,data){
          resolve(data) ;
          if(err)
          {
            console.log(err);
          }
      } );
      
  });
  }
  



  async ReadStatus(channel, wopid) {
    try {
      if (channel < 24) {
     

        let regaddress = this.OnOffstatusregstartaddress + channel * 4;

        let rv1 = await this.modbusMaster.readRS485Registers(regaddress, 4);
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
     

      console.log("ReadStatusString node_is_disconnect: " + this.node_is_disconnect + " , SlaveID : " + this.SlaveID  + ",node_error_count : " +this.node_error_count);
      //초기화 상태거나 에러상태이면 product code  값만 확인해서 정상적인지 확인함.
      if(this.node_is_disconnect == true)
      {
        const  rvp = await this.readRS485Registers(4,1);
        if (rvp != undefined)
        {

          this.node_product_code = rvp.data[0];

          if(this.node_product_code == KDCommon.getFoodJukebox_Productid())
          {
            
            this.node_is_disconnect=false;
            this.node_error_count=0;
          }

          
        }

        return null;



      }

      //30번 연속이면 센서노드 연결상태에러임.
      if(this.node_error_count >30)
      {
        this.node_is_disconnect=true;
        return null;
        
      }
      else{
        this.node_is_disconnect=false;
      }

      this.node_error_count++;







      let regaddress = this.OnOffstatusregstartaddress;

      let rv1 = await this.readRS485Registers(regaddress, 24 * 4); //await this.modbusMaster.readHoldingRegisters(regaddress, 24 * 4);
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


           //상태가 읽히면 에러 카운트 0
           this.node_error_count=0;


        }

        return retstring;
      }
      else{
        console.error( "ReadStatusString eror:");
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
      regdatas[1] = 202 + channel * 1000; //opid
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
      let regdatas = [];

      //await this.modbusMaster.setTimeout(this.DefaultTimeoutmsec);

    //  await this.CheckmySlaveID(this.DefaultTimeoutmsec);

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

        regdatas[chi * 4 + 1] = 202 + chi * 1000; //opid
        regdatas[chi * 4 + 2] = 0;
        regdatas[chi * 4 + 3] = 0;
      }
      let rv1 = await this.writeRS485Registers(regaddress, regdatas); //await this.modbusMaster.writeRegisters(regaddress, regdatas);
      

      if (rv1 != undefined) {
        return true;
      }
      return null;
    } catch (e) {}
  }
};
