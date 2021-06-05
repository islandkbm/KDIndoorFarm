import React, { useState, useEffect } from "react";
import Outputdevice from "../commonjs/outputdevice";
import IndoorFarmAPI from "../indoorfarmapi";

const Settingpage = () => {
  let rlist12 = [];
  let rlist24 = [];
  let devcopycfg;
  const [relaylist12, relayseleted12] = useState([]);
  const [relaylist24, relayseleted24] = useState([]);
  const [mSelecteditem, relayeditselected] = useState(null);
  const [moutdevarray, setUpdatedevice] = useState([]);

  for (let i = 0; i < 12; i++) {
    rlist12.push(i);
  }
  for (let i = 12; i < 24; i++) {
    rlist24.push(i);
  }

  /*
  for (let i = 1; i <= 12; i++) {
      if(i<10)
      {
    rlist12.push("R-0" +i);
      }
      else{
        rlist12.push("R-" + i);
      }
  }
  for (let i = 13; i <= 24; i++) {
    rlist24.push("R-" + i);
  }
*/
  function setupSave(mcfg) {
    console.log("setupSave uidd: " + mcfg.UniqID + " name : " + mcfg.Name);
    
    IndoorFarmAPI.setDeviceconfigsetup(mcfg).then((ret) => {
      if(ret ==true)
      {
        alert("저장되었습니다.");
        relayeditselected(null);
      }
      else{
        
      }


      console.log("setDeviceconfigsetup  uid: " + ret);
    });
  }
  function setupDelete(mcfg) {
    mcfg.DevType = Outputdevice.OutDeviceTypeEnum.ODT_DELETE;
    console.log("setupSave uidd: " + mcfg.UniqID + " name : " + mcfg.Name);
    IndoorFarmAPI.setDeviceconfigsetup(mcfg).then((ret) => {
      console.log("setDeviceconfigsetup  uid: " + ret);
    });
  }

  function inputonchangeHandler(e) {
    console.log("inputonchangeHandler : " + e.target.name);

    switch (e.target.name) {
      case "devname":
        devcopycfg.Name = e.target.value;
        break;

      case "relayradio":
        if (e.target.checked === true) {
          relayeditselected(e.target.id);
        }

        break;

      case "deviceradio":
        devcopycfg.DevType = e.target.value;
        if (e.target.checked === true) {
          devcopycfg.DevType = Number(e.target.id);

          console.log("devcopycfg.DevType : " + devcopycfg.DevType);
        }
        break;
    }
  }

  function Relayeditbox(myeditrelaynum, devicelist) {
    //const [misTimershow, selectcontrol] = useState(myeditcfg !=null && myeditcfg.istimer);
    //console.log("Autocontroleditbox  misTimershow: " + misTimershow);

    if (myeditrelaynum === null) {
      return <div></div>;
    } else {
      let devobj = null;

      for (const dev of devicelist) {
        if (myeditrelaynum == dev.UniqID) {
          devobj = dev;

          break;
        }
      }

      //설정된 object가 없으면 새로생성
      if (devobj === null) {
        devobj = Outputdevice.CreateDefulatDevice(myeditrelaynum);
      }

      devcopycfg = Outputdevice.Clonbyjsonobj(devobj);

      let devicon = "./image/devicon_" + devcopycfg.DevType + ".png";
      let onofficon = "./image/" + "on.png";

      let devicetypelist = [];

      for (let item in Outputdevice.OutDeviceTypeEnum) {
        if (Outputdevice.OutDeviceTypeEnum[item] != Outputdevice.OutDeviceTypeEnum.ODT_DELETE) {
          // console.log(Outputdevice.OutDeviceTypeEnum[item]);
          devicetypelist.push(Outputdevice.OutDeviceTypeEnum[item]);
        }
      }

      return (
        <div className="relaygroupbox">
          <div className="out_con">
            <div className="out_name">
              {" "}
              <img src={devicon} className="icon" /> {devcopycfg.Name}{" "}
            </div>
            <div className="out_value"> {} </div>
          </div>
          <div className="outportsetupbox">
            <h4>
              출력장치를 설정합니다.
              <button className="cont_save2" id="save" onClick={() => setupSave(devcopycfg)}>
                설정저장{" "}
              </button>
              <button className="cont_save2" id="delete" onClick={() => setupDelete(devcopycfg)}>
                설정삭제{" "}
              </button>
              <h5>설정변경시 모든자동제어가 다시 시작됩니다.</h5>
            </h4>

            <label>이름: </label>
            <input type="text" key={devcopycfg.UniqID} defaultValue={devcopycfg.Name} name="devname" onChange={inputonchangeHandler} />
            <h4>장치종류 :</h4>

            <div className="relaygroupbox" onChange={inputonchangeHandler}>
              {devicetypelist.map((localState, index) => deviceradiobox(localState, devcopycfg.DevType))}
            </div>
          </div>
        </div>
      );
    }
  }

  function deviceradiobox(devtypeid, selecttype) {
    let devicon = "./image/devicon_" + devtypeid + ".png";

    return (
      <div className="relaybox">
        <input type="radio" key={devcopycfg.UniqID + devtypeid} name="deviceradio" defaultChecked={selecttype == devtypeid ? true : false} id={devtypeid} />
        <img src={devicon} className="icon" />
      </div>
    );
  }

  function relayradiobox(relaynum, devicelist) {
    let devname = "사용안함";
    for (const dev of devicelist) {
      //=== 쓰지말자
      if (relaynum == dev.UniqID) {
        devname = dev.Name;
        break;
      }
    }

    let relayname;
    if (relaynum < 10) {
      relayname = "R-0" + (relaynum + 1);
    } else {
      relayname = "R-" + (relaynum + 1);
    }

    return (
      <div className="relaybox">
        <input type="radio" key={relayname} name="relayradio" defaultChecked={false} id={relaynum} /> {relayname}
        <img src="./image/relay.png" />
        <div>
          <label>{devname}</label>
        </div>
      </div>
    );
  }

  useEffect(() => {
    let interval = null;

    IndoorFarmAPI.getoutputstatus().then((devices) => {
      setUpdatedevice(devices);
      relayseleted12(rlist12);
      relayseleted24(rlist24);
    });
  }, []);

  return (
    <div>
      <div className="dev_name">릴레이를 선택하세요.</div>
      <div className="relay_select" onChange={inputonchangeHandler}>
        <div className="relaygroupbox">{relaylist12.map((localState, index) => relayradiobox(localState, moutdevarray))}</div>
        <div className="relaygroupbox">{relaylist24.map((localState, index) => relayradiobox(localState, moutdevarray))}</div>
      </div>
      {Relayeditbox(mSelecteditem, moutdevarray)}
    </div>
  );
};

export default Settingpage;
