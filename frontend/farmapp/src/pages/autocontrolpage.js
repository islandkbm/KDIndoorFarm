import React, { Component, useState, useEffect } from "react";
import AutoControlconfig from "../commonjs/autocontrolconfig";
import IndoorFarmAPI from "../indoorfarmapi";

const Autocontrolpage = () => {
  
  const [mSensors, setUpdatesensor] = useState([]);
  const [mAutolist, setUpdateauto] = useState([]);
  const [mDevices, setUpdatedevice] = useState([]);
  const [mSelecteditem, setupselected] = useState(null);

  useEffect(() => {
    IndoorFarmAPI.getautocontrols().then((mrsp) => {
  
      setUpdatesensor(mrsp.Sensors);
      setUpdateauto(mrsp.AutoControls);
      setUpdatedevice(mrsp.Outputs);
      
    });
  }, []);




  function autocontroleditbox(mydata,msensorlist,mdevlist) {

    
  
    
    if (mydata == null) {
      return <div></div>;
    } else {

      let copycfg =  AutoControlconfig.deepcopy(mydata.mConfig);
    
      
      function setupSave(mcfg) {
        console.log("setupSave uid: " +mcfg.uniqid + " name : " + mcfg.name);
        IndoorFarmAPI.setAutocontrolsetup(mcfg).then((ret) => {
          
          console.log("setAutocontrolsetup  uid: " +ret);

        });
      
      }
  
      
      function inputonchangeHandler(e)
    {
      console.log("inputonchangeHandler : " + e.target.name);

      if( e.target.name ==="name"){   copycfg.name = e.target.value; }
      if( e.target.name ==="onvalue"){   copycfg.onvalue = Number(e.target.value); }
      if( e.target.name ==="offvalue"){   copycfg.offvalue =Number( e.target.value); }
      
    }

    function sensorselectbox(mitem)
    {
      return (
        <ui>
        <input type="radio" key={mitem.uniqkey+mydata.mConfig.uniqid} name="sensorsel" defaultChecked={mitem.seleted}/>
          {mitem.title}
          </ui>
      );
    }

    
    function devicecheckbox(mitem)
    {
      return (
        <ui>
        <input type="checkbox" key={mitem.uniqkey+mydata.mConfig.uniqid} name="devcheck" defaultChecked={mitem.seleted}/>
          {mitem.title}
          </ui>
      );
    }


    let slist=[];
      for(const ss of msensorlist)
      {
        let seleted= false;
        if(mydata.mConfig.sensorid   === ss.UniqID)
        {
          console.log( "select sensorid : "+ss.UniqID);
          seleted=true;
        }
        const title=ss.Name  + "(노드:"+ss.nodeID +" , 채널 :"+ ss.channel+")";
        const uniqkey=ss.UniqID;
        slist.push({"title":title,"seleted":seleted , "uniqkey":uniqkey});

      }
      
      let dlist=[];
      for(const dev of mdevlist)
      {
        let seleted= false;

        for( const di of mydata.mConfig.devids)
        {
          if( di  === dev.UniqID)
          {
            console.log( "select dev id : "+dev.UniqID);
            seleted=true;
            break;
          }
        }
        const title=dev.Name + "( 채널 :"+ dev.Channel+")";
        const uniqkey=dev.UniqID;

        dlist.push({"title":title,"seleted":seleted, "uniqkey":uniqkey });

      }
      

      

      return (
        <div className="autosetupbox">
          <ul>{mydata.mConfig.name}</ul>
          <label>이름: </label>
          <input type="text" key ={"name"+mydata.mConfig.uniqid} defaultValue={mydata.mConfig.name}  name="name" onChange={inputonchangeHandler} />
          <ul>asdf {mydata.mConfig.devids[0]}</ul>

          <div className="outportselectbox" onChange={inputonchangeHandler}>
          {dlist.map((localState, index) =>  devicecheckbox(localState))}
          </div>
          


          <div className="sensorselectbox" onChange={inputonchangeHandler}>
          {slist.map((localState, index) =>  sensorselectbox(localState))}
          </div>
          
          

           


          <label>켜짐조건: </label>
          <input type="number" key ={"onvalue"+mydata.mConfig.uniqid} defaultValue={mydata.mConfig.onvalue}  name="onvalue" onChange={inputonchangeHandler} />
          <label>꺼짐조건: </label>
          <input type="number" key ={"offvalue"+mydata.mConfig.uniqid} defaultValue={mydata.mConfig.offvalue}  name="offvalue" onChange={inputonchangeHandler} />
          <p></p>

          <button onClick={() => setupSave(copycfg)} id="editcheck">
            {" "}
            저장
          </button>

          <button onClick={() => setupselected(null)} id="editcheck">
            {" "}
            취소
          </button>
        </div>
      );
    }
  }
  function autocontrolbox(mydata) {
    
    return (
      <div className="autocontrolbox">
        <ui> ... ...............</ui>
        <ui>{mydata.mConfig.name}</ui>
        <span> </span>
        <ui>{mydata.mConfig.enabled == true ? "작동중" : "정지됨"}</ui>
        <button onClick={() =>  setupselected(mydata)} id="editcheck">
          {" "}
          수정
        </button>
      </div>
    );
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
        <button>+ 추가</button>
      </div>
      <div className="autocontroltable">
        {autocontroleditbox(mSelecteditem,mSensors,mDevices)}

        {mAutolist.map((localState, index) => autocontrolbox(localState))}
      </div>
    </div>
  );
};

export default Autocontrolpage;
