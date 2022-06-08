import React, { useState, useEffect } from "react";

const Factorysetup = () => {
  
  useEffect(() => {


  }, []);


  
  function inputonchangeHandler(e) {
    console.log("inputonchangeHandler : " + e.target.name);

    switch (e.target.name) {
      case "devname":
     
        break;

     
    }
  }


  return (
    <div>
      <div className="dev_name">Factory setup</div>
      <div className="conditionselectbox" onChange={inputonchangeHandler}>
                  <input type="radio" key={"fjbox" } name="conditionsel" defaultChecked="true" id="fjbox" /> 푸드쥬크박스
                  <input type="radio" key={"indoor"} name="conditionsel" defaultChecked="false" id="indoor" />식물공장_VFC3300MD
     </div>

      <label>장비고유번호: </label>
      <input type="text" key="devuniqid" defaultValue="IF0000" name="devuniqname" onChange={inputonchangeHandler} />
      <div>
      <label>비밀번호: </label>
      <input type="text" key="devpassword" defaultValue="0000" name="devpassword" onChange={inputonchangeHandler} />
      </div>

      <div className="control_end">
              <button className="cont_save" onClick={() => {}} id="editcheck">
                저장{" "}
              </button>
              <button className="cont_reset" onClick={() => {}} id="editcheck">
                취소{" "}
              </button>
            </div>


    </div>
  );
};

export default Factorysetup;
