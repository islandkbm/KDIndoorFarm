import React, {  useState, useEffect } from "react";
import AutoControlconfig from "../commonjs/autocontrolconfig";
import myGlobalvalues from "../myGlobal";
import AutoControl from "../commonjs/autocontrol.js";


const Autocontrolpage = () => {
  const [mSensors, setUpdatesensor] = useState([]);
  const [mAutolist, setUpdateauto] = useState([]);
  const [mDevices, setUpdatedevice] = useState([]);
  const [mSelecteditem, setupselected] = useState(null);

  console.log("Autocontrolpage: ");

  useEffect(() => {
    myGlobalvalues.farmapi.getautocontrols().then((mrsp) => {
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

        myGlobalvalues.farmapi.setAutocontrolsetup(mcfg).then((ret) => {
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
          //????????????
          if (isexist === false) {
            copycfg.devids.push(Number(e.target.id));
          }
          //console.log({copycfg});
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
            <input type="checkbox" key={copycfg.uniqid} name="devcheck" defaultChecked={mitem.seleted} id={mitem.uniqkey} /> {mitem.title}
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
        const title = ss.Name + "(??????:" + ss.nodeID + " , ?????? :" + ss.channel + ")";
        const uniqkey = ss.UniqID;
        slist.push({ title: title, seleted: seleted, uniqkey: uniqkey });
      }

      let dlist = [];
      for (const dev of mdevlist) {
        let seleted = false;

        for (const di of copycfg.devids) {
          if (di == dev.UniqID) {
            console.log("select dev id : " + dev.UniqID);
            seleted = true;
            break;
          }
        }
        const title = dev.Name + "( ?????? :" + dev.Channel + ")";
        const uniqkey = dev.UniqID;

        dlist.push({ title: title, seleted: seleted, uniqkey: uniqkey });
      }

      return (
        <div className="auto_control">
          <div className="auto_title" onChange={inputonchangeHandler}>
            <div className="auto_name">???????????? ???????????? :</div>
            <div className="auto_stop">
              <input type="radio" key={"enable" + copycfg.uniqid} name="autoenable" defaultChecked={copycfg.enabled} id="enable" /> ????????????
              <input type="radio" key={"disable" + copycfg.uniqid} name="autoenable" defaultChecked={copycfg.enabled === false} id="disable" /> ??????(????????????)
            </div>
          </div>

          <div className="autosetupinnerbox">
            <div className="auto_input">
              <div className="aut_in">
                ?????? :
                <input type="text" key={"name" + copycfg.uniqid} defaultValue={copycfg.name} name="name" onChange={inputonchangeHandler} />
              </div>
              <div className="aut_in">
                ???????????? :
                <input type="time" key={"starttime" + copycfg.uniqid} defaultValue={secToTime(copycfg.starttime)} name="starttime" onChange={inputonchangeHandler} />
              </div>
              <div className="aut_in">
                ???????????? :
                <input type="time" key={"endtime" + copycfg.uniqid} defaultValue={secToTime(copycfg.endtime)} name="endtime" onChange={inputonchangeHandler} />
              </div>
            </div>

            <div className="device" onChange={inputonchangeHandler}>
              <div className="dev_name">???????????? ??????</div>
              <div className="dev_select">{dlist.map((localState, index) => devicecheckbox(localState))}</div>
            </div>

            <div>
              <div className="two_radio" onChange={inputonchangeHandler}>
                <input type="radio" key={"timer" + copycfg.uniqid} name="controlsel" defaultChecked={copycfg.istimer} id="timer" /> ????????? ??????
                <input type="radio" key={"sensor" + copycfg.uniqid} name="controlsel" defaultChecked={copycfg.istimer === false} id="sensor" />
                ????????????
              </div>

              <div className="sensorconditionbox" style={copycfg.istimer === false ? {} : { display: "none" }}>
                <div className="con_sen" onChange={inputonchangeHandler}>
                  <div className="cons_name">????????????</div>
                  <div className="cons_radio">{slist.map((localState, index) => sensorselectbox(localState))}</div>
                </div>

                <div className="conditionselectbox" onChange={inputonchangeHandler}>
                  <input type="radio" key={"up" + copycfg.uniqid} name="conditionsel" defaultChecked={copycfg.condition === "up"} id="up" /> ????????????
                  <input type="radio" key={"down" + copycfg.uniqid} name="conditionsel" defaultChecked={copycfg.condition === "down"} id="down" />
                  ???????????????
                </div>

                <label>????????????: </label>
                <input type="number" key={"onvalue" + copycfg.uniqid} defaultValue={copycfg.onvalue} name="onvalue" onChange={inputonchangeHandler} />
                <label>????????????: </label>
                <input type="number" key={"offvalue" + copycfg.uniqid} defaultValue={copycfg.offvalue} name="offvalue" onChange={inputonchangeHandler} />
              </div>
              <p></p>
              <label>1????????? ??????????????????: </label>
              <input type="number" key={"onetime_run" + copycfg.uniqid} defaultValue={copycfg.onetime_run} name="onetime_run" onChange={inputonchangeHandler} />

              <label>1???????????? ????????????: </label>
              <input type="number" key={"onetime_idle" + copycfg.uniqid} defaultValue={copycfg.onetime_idle} name="onetime_idle" onChange={inputonchangeHandler} />
            </div>

            <div className="control_end">
              <button className="cont_save" onClick={() => setupSave(copycfg)} id="editcheck">
                ??????{" "}
              </button>
              <button className="cont_reset" onClick={() => setupselected(null)} id="editcheck">
                ??????{" "}
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
  function autocontrolbox(mydata) {
    let autostate = <label className="auto_result"> ?????????</label>;

    if (mydata.mConfig.enabled === true) {
      let onofficon = "./image/" + (mydata.mState.onoffstate ? "on" : "off") + ".png";

      ///<img src={onofficon} className="onoff" />
      autostate = <label className="auto_result"> ?????????</label>;
    }

    return (
      <div className="auto_seln">
        <label className="auto_inname">{mydata.mConfig.name}</label>

        {autostate}
        <div className="auto_change">
          <button className="change_but" onClick={() => setupselected(AutoControlconfig.deepcopy(mydata.mConfig))} id="editcheck">
            ????????????
          </button>
        </div>
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
      <div className="auto">
        <div className="select">
          <div className="select_name">?????? :</div>
          <div class="select_sort">
            <select name="sort">
              <option value="1">????????????</option>
              <option value="2">????????????</option>
              <option value="3">????????????</option>
            </select>
          </div>
          <div className="select_add">
            <button className="add_button" onClick={() => onAdd()}>
              + ??????
            </button>
          </div>
        </div>
      </div>
      <div className="autocontroltable">
        {Autocontroleditbox(mSelecteditem, mSensors, mDevices)}

        {mAutolist.map((localState, index) => autocontrolbox(localState))}
      </div>
    </div>
  );
};

export default Autocontrolpage;
