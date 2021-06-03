const AutoControlStatus = require("./autocontrolstatus");


module.exports = class AutoControl {
  constructor(mconfig) {
    this.mConfig = mconfig;
    this.mState = new AutoControlStatus(mconfig.UniqID);
  }

  static Clonbyjsonobj(mobj) {
    return new AutoControl(mobj.mConfig);
  }

  //테스트용 나중에 삭제..
  controlbypwm() {
    let mstatus = true;

    if (this.mState.pwmonoffstate === true) {
      this.mState.pwmontime_count++;
      if (this.mState.pwmontime_count >= this.mConfig.pwmontime) {
        this.mState.pwmofftime_count = 0;
        this.mState.pwmonoffstate = false;
      }
      mstatus = true;
    } else {
      this.mState.pwmofftime_count++;
      if (this.mState.pwmofftime_count >= this.mConfig.pwmofftime) {
        this.mState.pwmontime_count = 0;
        this.mState.pwmonoffstate = true;
      }

      mstatus = false;
    }

    return mstatus;
  }
  controlbytimer() {
    return true;
  }
  controlbysensor(msensors) {
    let mstatus = null;

    for (const ms of msensors) {
      if (ms.UniqID === this.mConfig.sensorid) {
        if (this.mConfig.condition === "up") {
          if (ms.value > this.mConfig.onvalue) {
            mstatus = true;
          } else {
            if (ms.value < this.mConfig.offvalue) {
              mstatus = false;
            }
          }
        } else {
          if (ms.value < this.mConfig.onvalue) {
            mstatus = true;
          } else {
            if (ms.value > this.mConfig.offvalue) {
              mstatus = false;
            }
          }
        }

        break;
      }
    }

    return mstatus;
  }
  //자동제어로 동작한후 상태가 변경되면  true  리턴
  ischangebycontrol(msensors, timesecnow) {
    let mstatus = false;
    if (this.mConfig.enabled === false) {
      return false;
    }

    if (timesecnow >= this.mConfig.starttime && timesecnow < this.mConfig.endtime) {
      if (this.istimer === true) {
        mstatus = this.controlbytimer();
      } else if (this.mConfig.pwmcontrolenable === true) {
        mstatus = this.controlbypwm();
      } else {
        mstatus = this.controlbysensor(msensors);
      }
    } else {
      mstatus = false;
    }
    return this.mState.ischangestatecheck(mstatus);
  }
};
