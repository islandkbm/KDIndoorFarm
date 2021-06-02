import React, { useState, useEffect } from "react";
import Sensordisplay from "../sensordisplay";
import IndoorFarmAPI from "../indoorfarmapi";
import { ResponsiveBump } from '@nivo/bump'


import { LineChart, ResponsiveContainer,Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function MyLineRechart()
{

    const data = [
        {
            "name": "Jan 2019",
            "Product A": 3432,
            "Procuct B": 2342
        },
        {
            "name": "Feb 2019",
            "Product A": 2342,
            "Procuct B": 3246
        },
        {
            "name": "Mar 2019",
            "Product A": 4565,
            "Procuct B": 4556
        },
        {
            "name": "Apr 2019",
            "Product A": 6654,
            "Procuct B": 4465
        },
        {
            "name": "May 2019",
            "Product A": 8765,
            "Procuct B": 4553
        }
    ];

    
        return (
          <ResponsiveContainer
        width="100%"
      >
            <LineChart  height={250} data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Product A" stroke="#0095FF" />
                <Line type="monotone" dataKey="Procuct B" stroke="#FF0000" />
            </LineChart>
            </ResponsiveContainer>
        );
    
}


const Sensorpage = () => {


    const [msensorsarray, setSensors] = useState([]);
  
    useEffect(() => {
      let interval = null;
  
      interval = setInterval(() => {
        IndoorFarmAPI.getsensordatas().then((sensors) => {
          setSensors(sensors);
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }, [msensorsarray]);

    
    return(
        
            <div>
              {Sensordisplay(msensorsarray,true)}

              <div className="chartcontainer">
                {MyLineRechart()}
                </div>
              </div>
        
    )
}

export default Sensorpage;