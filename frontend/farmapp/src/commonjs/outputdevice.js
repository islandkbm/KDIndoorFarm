const fs = require("fs");

class Outputdevice {
  static OPStatus = Object.freeze({
    OPS_Off: "off", //꺼짐
    OPS_On: "on", //켜짐
    OPS_Local: "local", //현장수동제어
    OPS_Idle: "idle",
  });

  static OutDeviceTypeEnum = Object.freeze({
    ODT_None: 0,
    ODT_PUMP: 1, //
    ODT_FAN: 2,
    ODT_VALVE: 3,
    ODT_LED: 4,
    ODT_COOLER: 5,
    ODT_HEATER: 6,
    ODT_ETC: 99,
  });

  static Writefile(filename, mlist) {
    let data = JSON.stringify(mlist);
    fs.writeFileSync(filename, data);
  }
  static Readfile(filename) {
    let rawdata = fs.readFileSync(filename);
    let objlist = JSON.parse(rawdata);

    let alist = [];
    objlist.forEach((element) => {
      alist.push(Object.assign(new Outputdevice(), element));
    });

    return alist;
  }

  static Clonbyjsonobj(mobj) {
    return Object.assign(new Outputdevice(), mobj);
  }

  constructor() {
    this.UniqID = 0; ///고유식별 id 릴레이번호로 입력 0~23
    this.Name = 0;
    this.Channel = 0;
    this.DevType = 0;
    this.Status = 0;
    this.Autocontrolid = 0;
  }
}

module.exports = Outputdevice;
