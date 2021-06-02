import React, { Component, useState, useEffect } from "react";
import AutoControlconfig from "../commonjs/autocontrolconfig";
import AutoControl from "../commonjs/autocontrol";
import IndoorFarmAPI from "../indoorfarmapi";

const Autocontrolpage = () => {
  const [mSensors, setUpdatesensor] = useState([]);
  const [mAutolist, setUpdateauto] = useState([]);
  const [mDevices, setUpdatedevice] = useState([]);
  const [mSelecteditem, setupselected] = useState(null);

  console.log("Autocontrolpage: ");

  useEffect(() => {
    IndoorFarmAPI.getautocontrols().then((mrsp) => {
      setUpdatesensor(mrsp.Sensors);
      setUpdateauto(mrsp.AutoControls);
      setUpdatedevice(mrsp.Outputs);
    });
  }, []);

  function secToTime(dayseconds) {
    if (dayseconds >= 24 * 3600) {
      return "23:59";
    }
    let hour = Math.floor(dayseconds / 3600);
    let min = Math.floor((dayseconds - hour * 3600) / 60);
    if (hour < 10) hour = "0" + hour;
    if (min < 10) min = "0" + min;
    console.log("secToTime : " + (hour + ":" + min));
    return hour + ":" + min;
  }

  function timeTosec(timestr) {
    const [hours, minutes] = timestr.split(":");
    return Number(hours * 3600 + minutes * 60);
  }

  function Autocontroleditbox(myeditcfg, msensorlist, mdevlist) {
    //const [misTimershow, selectcontrol] = useState(myeditcfg !=null && myeditcfg.istimer);
    //console.log("Autocontroleditbox  misTimershow: " + misTimershow);

    if (myeditcfg == null) {
      return <div></div>;
    } else {
      let copycfg = myeditcfg; // AutoControlconfig.deepcopy(mydata.mConfig);

      console.log("Autocontroleditbox  copycfg.istimer: " + copycfg.istimer);

      //selectcontrol(copycfg.istimer);

      //let starttime_sec =/3600)+":"+ ((mydata.mConfig.starttime/60)%60);
      //let endtime_sec = (mydata.mConfig.endtime/3600)+":"+ ((mydata.mConfig.endtime/60)%60);

      function setupSave(mcfg) {
        console.log("setupSave uid: " + mcfg.uniqid + " name : " + mcfg.name + " istimer : " + mcfg.istimer);

        console.log("setupSave uid: " + " copycfg istimer : " + copycfg.istimer);

        IndoorFarmAPI.setAutocontrolsetup(mcfg).then((ret) => {
          console.log("setAutocontrolsetup  uid: " + ret);
        });
      }

      function inputonchangeHandler(e) {
        console.log("inputonchangeHandler : " + e.target.name);

        switch (e.target.name) {
          case "name":
            copycfg.name = e.target.value;
            break;

          case "onvalue":
            copycfg.onvalue = Number(e.target.value);
            break;
          case "offvalue":
            copycfg.offvalue = Number(e.target.value);
            break;

          case "starttime":
            copycfg.starttime = timeTosec(e.target.value);
            break;
          case "endtime":
            copycfg.endtime = timeTosec(e.target.value);
            break;

          case "controlsel":
            if (e.target.checked === true && e.target.id === "timer") {
              copycfg.istimer = true;
            } else {
              copycfg.istimer = false;
            }

            setupselected(AutoControlconfig.deepcopy(copycfg));
            break;
          case "autoenable":
            if (e.target.checked === true && e.target.id === "enable") {
              copycfg.enabled = true;
            } else {
              copycfg.enabled = false;
            }

          //  setupselected(AutoControlconfig.deepcopy(copycfg));

        }

        if (e.target.name === "devcheck") {
          let isexist = false;
          for (let i = 0; i < copycfg.devids.length; i++) {
            if (copycfg.devids[i] === Number(e.target.id)) {
              if (e.target.checked === false) {
                copycfg.devids.splice(i, 1);
                return;
              } else {
                isexist = true;
                break;
              }
            }
          }
          //새로추가
          if (isexist === false) {
            copycfg.devids.push(Number(e.target.id));
          }
        }
      }

      function sensorselectbox(mitem) {
        return (
          <ui>
            <input type="radio" key={copycfg.uniqid} name="sensorsel" defaultChecked={mitem.seleted} id={mitem.uniqkey} />
            {mitem.title}
          </ui>
        );
      }

      function devicecheckbox(mitem) {
        return (
          <ui>
            <input type="checkbox" key={copycfg.uniqid} name="devcheck" defaultChecked={mitem.seleted} id={mitem.uniqkey} />
            {mitem.title}
          </ui>
        );
      }

      let slist = [];
      for (const ss of msensorlist) {
        let seleted = false;
        if (copycfg.sensorid === ss.UniqID) {
          console.log("select sensorid : " + ss.UniqID);
          seleted = true;
        }
        const title = ss.Name + "(노드:" + ss.nodeID + " , 채널 :" + ss.channel + ")";
        const uniqkey = ss.UniqID;
        slist.push({ title: title, seleted: seleted, uniqkey: uniqkey });
      }

      let dlist = [];
      for (const dev of mdevlist) {
        let seleted = false;

        for (const di of copycfg.devids) {
          if (di === dev.UniqID) {
            console.log("select dev id : " + dev.UniqID);
            seleted = true;
            break;
          }
        }
        const title = dev.Name + "( 채널 :" + dev.Channel + ")";
        const uniqkey = dev.UniqID;

        dlist.push({ title: title, seleted: seleted, uniqkey: uniqkey });
      }

      return (
        <div className="autosetupbox">
          
           <div className="autoenable" onChange={inputonchangeHandler}>
                <h4>자동제어 운전변경: 
                <input type="radio" key={"enable" + copycfg.uniqid} name="autoenable" defaultChecked={copycfg.enabled} id="enable" /> 자동운전
                <input type="radio" key={"disable" + copycfg.uniqid} name="autoenable" defaultChecked={copycfg.enabled === false} id="disable"/>정지(수동제어)
                </h4>
              </div>

          <div className="autosetupinnerbox" >
            <ul>{}</ul>
            <label>이름: </label>
            <input type="text" key={"name" + copycfg.uniqid} defaultValue={copycfg.name} name="name" onChange={inputonchangeHandler} />

            <label>시작시간: </label>
            <input type="time" key={"starttime" + copycfg.uniqid} defaultValue={secToTime(copycfg.starttime)} name="starttime" onChange={inputonchangeHandler} />
            <label>종료시간: </label>
            <input type="time" key={"endtime" + copycfg.uniqid} defaultValue={secToTime(copycfg.endtime)} name="endtime" onChange={inputonchangeHandler} />
            <p></p>

            <div className="outportselectbox" onChange={inputonchangeHandler}>
              <h4>출력장치 선택</h4>
              {dlist.map((localState, index) => devicecheckbox(localState))}
            </div>
            <p></p>
            <div>
              <div className="controlselectbox" onChange={inputonchangeHandler}>
                <input type="radio" key={"timer" + copycfg.uniqid} name="controlsel" defaultChecked={copycfg.istimer} id="timer" /> 타임머 제어
                <input type="radio" key={"sensor" + copycfg.uniqid} name="controlsel" defaultChecked={copycfg.istimer === false} id="sensor" />
                센서제어
              </div>

              <div className="sensorconditionbox" style={copycfg.istimer === false ? {} : { display: "none" }}>
                <div className="sensorselectbox" onChange={inputonchangeHandler}>
                  <h4>센서선택</h4>
                  {slist.map((localState, index) => sensorselectbox(localState))}
                </div>

                <div className="conditionselectbox" onChange={inputonchangeHandler}>
                  <input type="radio" key={"up" + copycfg.uniqid} name="conditionsel" defaultChecked={copycfg.condition === "up"} id="up" /> 크면켜짐
                  <input type="radio" key={"down" + copycfg.uniqid} name="conditionsel" defaultChecked={copycfg.condition === "down"} id="down" />
                  작으면켜짐
                </div>

                <label>켜짐조건: </label>
                <input type="number" key={"onvalue" + copycfg.uniqid} defaultValue={copycfg.onvalue} name="onvalue" onChange={inputonchangeHandler} />
                <label>꺼짐조건: </label>
                <input type="number" key={"offvalue" + copycfg.uniqid} defaultValue={copycfg.offvalue} name="offvalue" onChange={inputonchangeHandler} />
              </div>
              <p></p>
              <label>1회구동 최대구동시간: </label>
              <input type="number" key={"onetime_run" + copycfg.uniqid} defaultValue={copycfg.onetime_run} name="onetime_run" onChange={inputonchangeHandler} />

              <label>1회구동후 쉬는시간: </label>
              <input type="number" key={"onetime_idle" + copycfg.uniqid} defaultValue={copycfg.onetime_idle} name="onetime_idle" onChange={inputonchangeHandler} />
            </div>

            <p></p>

            <button onClick={() => setupSave(copycfg)} id="editcheck">
              {" "}
              저장{" "}
            </button>
            <button onClick={() => setupselected(null)} id="editcheck">
              취소{" "}
            </button>
          </div>
        </div>
      );
    }
  }
  function autocontrolbox(mydata) {
    return (
      <div className="autocontrolbox">
        <ui>{mydata.mConfig.name}</ui>

        <ui>{mydata.mConfig.enabled == true ? "  작동중" : "  정지됨"}</ui>
        <button onClick={() => setupselected(AutoControlconfig.deepcopy(mydata.mConfig))} id="editcheck">
          설정변경
        </button>
      </div>
    );
  }

  function onAdd() {
    let newauto = new AutoControl(new AutoControlconfig());
    mAutolist.push(newauto);
    setUpdateauto(mAutolist);
    setupselected(newauto.mConfig);
  }

  return (
    <div>
      <h4>Autocontrol Page</h4>
      <div className="controltop">
        정렬 :
        <select name="pets" id="pet-select">
          <option value="1">시간순서</option>
          <option value="2">이름순서</option>
          <option value="3">카테고리</option>
        </select>
        <button onClick={() => onAdd()}>+ 추가</button>
      </div>
      <div className="autocontroltable">
        {Autocontroleditbox(mSelecteditem, mSensors, mDevices)}
        {mAutolist.map((localState, index) => autocontrolbox(localState))}
      </div>
    </div>
  );
};

export default Autocontrolpage;