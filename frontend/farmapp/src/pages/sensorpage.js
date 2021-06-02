import React, { useState, useEffect } from "react";
import Sensordisplay from "../sensordisplay";
import IndoorFarmAPI from "../indoorfarmapi";
import { ResponsiveBump } from '@nivo/bump'



// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function MyResponsiveBump( data)
{

return (
  <ResponsiveBump
      data={data}
      margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
      colors={{ scheme: 'spectral' }}
      lineWidth={3}
      activeLineWidth={6}
      inactiveLineWidth={3}
      inactiveOpacity={0.15}
      pointSize={10}
      activePointSize={16}
      inactivePointSize={0}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={3}
      activePointBorderWidth={3}
      pointBorderColor={{ from: 'serie.color' }}
      axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendPosition: 'middle',
          legendOffset: -36
      }}
      axisRight={null}
      axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendPosition: 'middle',
          legendOffset: 32
      }}
      axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'ranking',
          legendPosition: 'middle',
          legendOffset: -40
      }}
  />
);
    }


const Sensorpage = () => {

  const h1data = [
    {
      "id": "First",
      "data": [
        {
          "x": 2000,
          "y": 4
        },
        {
          "x": 2001,
          "y": 7
        },
        {
          "x": 2002,
          "y": 11
        },
        {
          "x": 2003,
          "y": 12
        },
        {
          "x": 2004,
          "y": 2
        }
      ]
    },
    {
      "id": "Second",
      "data": [
        {
          "x": 2000,
          "y": 10
        },
        {
          "x": 2001,
          "y": 2
        },
        {
          "x": 2002,
          "y": 3
        },
        {
          "x": 2003,
          "y": 7
        },
        {
          "x": 2004,
          "y": 8
        }
      ]
    },
    {
      "id": "Last",
      "data": [
        {
          "x": 2000,
          "y": 9
        },
        {
          "x": 2001,
          "y": 5
        },
        {
          "x": 2002,
          "y": 8
        },
        {
          "x": 2003,
          "y": 5
        },
        {
          "x": 2004,
          "y": 12
        }
      ]
    },
    {
      "id": "Serie 4",
      "data": [
        {
          "x": 2000,
          "y": 7
        },
        {
          "x": 2001,
          "y": 4
        },
        {
          "x": 2002,
          "y": 2
        },
        {
          "x": 2003,
          "y": 11
        },
        {
          "x": 2004,
          "y": 9
        }
      ]
    }
  
  ];


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
        
            <div className="sensorbocck">
              {Sensordisplay(msensorsarray,true)}



              </div>
        
    )
}

export default Sensorpage;