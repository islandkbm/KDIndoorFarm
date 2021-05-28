import React from 'react';
import Sensordisplay from "../sensordisplay";

const Sensorpage = () => {
    return(
        <div>
            <h2>Sensor Page</h2>
            <div className="sensorbocck">{Sensordisplay(1000,true)}</div>
        </div>
    )
}

export default Sensorpage;