//자동제어시 변경되는 상태나 변수를 저장함.
module.exports = class AutoControlStatus {
  constructor() {
    this.pwmonoffstate = false;

    this.pwmontime_count = 0;
    this.pwmofftime_count = 0;

    //처음초기화상태
    this.onoffstate = null;
  }
  ischangestatecheck(newstate) {
    if (newstate != null) {
      //초기화상태이면 on이던 off 상태를 바로 변경함.
      if (this.onoffstate===null)
      {
        this.onoffstate = newstate;
        return true;
      }

      if (this.onoffstate != newstate) {
        this.onoffstate = newstate;
        return true;
      }
    }
    else{
      //초기화상태이고 조건이 알수없는 조건이면  off로 우선설정
      if (this.onoffstate===null)
      {
        this.onoffstate = false;
        return true;
      }
    }
    return false;
  }
};
