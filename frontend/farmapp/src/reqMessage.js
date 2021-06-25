export default class reqMessage {

  constructor(pid) {
    let today = new Date(); 
    this.datetime=today.toLocaleString();//요청된 날자+시간
    this.puniqid=pid;//제품 구별 ID 필수
  }


  getSensors = false;
  getOutputport = false;
  getAutoControl = false;
  getAutoControlstate = false;

  setManualControl = false;
  setAutocontrol = false;
  setDeviceconfig = false;

  OutputManual = [];
  Autoconfigitem = null;
  Deviceconfigitem = null;
}
