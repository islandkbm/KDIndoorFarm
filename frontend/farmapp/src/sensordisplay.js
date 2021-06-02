
import React from "react";

function SensorBox(msensor) {
  let cname ="sen_con";
  let svalue;
  let iconsrc="./image/sensor_"+msensor.Sensortype+".png";


  if(msensor.errorcount >30)
  {
    cname ="sen_dis";
    svalue=(<div className="sen_result">   <span className="blinking">연결끊김</span>   </div>);
  }
  else{

    svalue=(<div className="sen_value">
      <label className="value">{msensor.valuestring}</label> 
    <label className="unit">{" "+msensor.ValueUnit}</label>
    </div>
     );

  }

      return (
        <div className={cname}>
          <div className="sen_name">
                        <img src={iconsrc} className="icon" /> {msensor.Name}
                        </div>
                    
                      {svalue}
                      
                  

          
        </div>
      );
    
  }

  function Sensordisplay(msensorsarray, isonlystatus) {
    return (
      <div className="sensor">
        <div class="sen_title">SENSOR DISPLAY</div>
        {msensorsarray.map((localState, index) => SensorBox(localState))}
      </div>
    );
  }


  

export default Sensordisplay;