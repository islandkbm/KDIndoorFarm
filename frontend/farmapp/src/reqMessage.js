export default class reqMessage {

  constructor(pid) {
    let today = new Date(); 
    this.datetime=today.toLocaleString();//요청된 날자+시간
    this.puniqid=pid;//제품 구별 ID 필수
  }


  getSensors = undefined;
  getOutputport = undefined;
  getAutoControl = undefined;
  getAutoControlstate = undefined;

  setManualControl = undefined;
  setAutocontrol = undefined;
  setDeviceconfig = undefined;

  OutputManual = [];
  Autoconfigitem = undefined;
  Deviceconfigitem = undefined;
}
