const Sensordevice = require("../frontend/farmapp/src/commonjs/sensordevice.js");

const KDCommon = require("../frontend/farmapp/src/commonjs/kdcommon");





module.exports = class SensorNode {
  constructor(slaveid, mmaster) {
    this.NodeName = "nuknown";
    this.DefaultTimeoutmsec = 200;
    this.SlaveID = slaveid;
    this.modbusMaster = mmaster;
    this.SensorCodes = [];
    this.KDDefaultRegAddr =40; //kd 전용 센서값연속적
    this.node_error_count=0;
    this.node_is_disconnect=true;
    this.node_product_code=0;
  }
    async ReadSensor(sensorcode) {
    try {
  
      let sensorchannel = (sensorcode >> 8) & 0xff;
      let sensortype = sensorcode & 0xff;
      let regaddress = 301 + sensorchannel * 200 + sensortype * 3;
      if (regaddress > 300 && regaddress < 1100) {
        let rv1 = await this.modbusMaster.readRS485Registers(regaddress, 3);
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
          if(err)
          {
            
            console.log(err);
          }
      } );
      
  });
   

  }

  async ReadDummy() {

    const  rv1 = await this.readRS485Registers(10, 1); //this.modbusMaster.readHoldingRegisters(regaddress, sensorreadcount * 3);
    return rv1;

  }

  async ReadSensorAll() {
    try {


      console.log("ReadSensorAll node_is_disconnect: " + this.node_is_disconnect + " , SlaveID : " + this.SlaveID  + ",node_error_count : " +this.node_error_count);
      //초기화 상태거나 에러상태이면 product code  값만 확인해서 정상적인지 확인함.
      if(this.node_is_disconnect == true)
      {
        const  rvp = await this.readRS485Registers(4,1);
        if (rvp != undefined)
        {

          this.node_product_code = rvp.data[0];

          if(this.node_product_code == KDCommon.getFoodJukebox_Productid())
          {
            this.KDDefaultRegAddr =140;
            
          }
          this.node_is_disconnect=false;
          this.node_error_count=0;

          console.log("node_product_code : " + this.node_product_code );


          
        }
        else{
          
          //console.log("ReadSensorAll await 500: ");
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



      const sensorreadcount = 20;
      let regaddress = this.KDDefaultRegAddr;
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
            //센서가 읽히면 에러 카운트 0
            this.node_error_count=0;

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
