import React from 'react';
import Outputdevicedisplay from "../outputdevicedisplay";

const Devicepage = () => {
    return(
        <div>
            <h2>Device Page</h2>
            <div className="outputblock">{Outputdevicedisplay(1000,false)}</div>
        </div>
    )
}

export default Devicepage;