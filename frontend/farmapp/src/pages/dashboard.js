
import React, { Component,useState, useEffect } from "react";
import Sensordisplay from "../sensordisplay";
import Outputdevicedisplay from "../outputdevicedisplay";





const Dashboard = () => {
    return(
        <div>
            <h2>dashboard Page</h2>
            <div className="sensorbocck">{Sensordisplay(2000,true)}</div>
            <div className="outputblock">{Outputdevicedisplay(2000,true)}</div>

        </div>
    )
}

export default Dashboard;