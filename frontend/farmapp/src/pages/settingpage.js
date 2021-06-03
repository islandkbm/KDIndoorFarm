import React, { useState, useEffect } from "react";
import Sensordisplay from "../sensordisplay";
import IndoorFarmAPI from "../indoorfarmapi";


function Relayeditbox(myeditrelay) {
    //const [misTimershow, selectcontrol] = useState(myeditcfg !=null && myeditcfg.istimer);
    //console.log("Autocontroleditbox  misTimershow: " + misTimershow);

    let devicon = "./image/devicon_1" +  ".png";
    let onofficon = "./image/" +  "on.png";

    if (myeditrelay === null) {
      return (<div></div>);
    } else {
      let copycfg = myeditrelay; // AutoControlconfig.deepcopy(mydata.mConfig);

      return (
      <div>
                <h4>출력포트를 설정합니다.</h4>
          
                <div className="out_con">
                <div className="out_name"> <img src={devicon} className="icon" />   {myeditrelay}    </div>
            <div className="out_value"> <img src={onofficon} className="onoff" />   </div>

            </div>
              {myeditrelay}
              
             </div>
          );
    }
    

}


const Settingpage = () => {
  let rlist12 = [];
  let rlist24 = [];
  const [relaylist12, relayseleted12] = useState([]);
  const [relaylist24, relayseleted24] = useState([]);
  const [mSelecteditem, relayeditselected] = useState(null);


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


  function relayonchangeHandler(e) {
    console.log("inputonchangeHandler : " + e.target.name);

    switch (e.target.name) {
      case "relayradio":
        if (e.target.checked === true)
        {
            relayeditselected( e.target.id);
        }
        
        break;
    }

}
  function relayradiobox(relayname) {
    return (
      <div className="relaybox">
        <input type="radio" key={relayname} name="relayradio" defaultChecked={false} id={relayname} /> {relayname}
        <img src="./image/relay.png" /> 

      </div>
    );
  }

  useEffect(() => {
    let interval = null;
    relayseleted12(rlist12);
    relayseleted24(rlist24);
  }, []);

  return (
    <div>
      <div className="dev_name">출력장치 선택</div>
      <div className="relay_select" onChange={relayonchangeHandler}>
      <div className="relaygroupbox">
        {relaylist12.map((localState, index) => relayradiobox(localState))}
        </div>
        <div className="relaygroupbox">
        {relaylist24.map((localState, index) => relayradiobox(localState))}
        </div>
        
    </div>
      {Relayeditbox(mSelecteditem)}

    </div>
  );
};

export default Settingpage;
