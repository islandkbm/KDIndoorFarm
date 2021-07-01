import React, { useState, useEffect } from 'react';
import Sensordisplay from "../sensordisplay";

import firebase from "../firebase.js";
import reqMessage from "../reqMessage";

import myGlobalvalues from "../myGlobal";



let database = firebase.database();
let frrequest =database.ref('Sensors/request/message');
let frresponse =database.ref('Sensors/response/message');



function sendfirebase() {

   

    const reqmsg = new reqMessage("IF9999");
    reqmsg.getSensors=true;
    console.log("send firebase");
    frrequest.set(JSON.stringify(reqmsg));
    
  }

  

  

const About = () => {

    const [reqvlaue, requestupdate] = useState(1);
    const [repvalue, reponseupdate] = useState(1);
    const [msensorsarray, setSensors] = useState([]);
  


    
  useEffect(() => {


    console.log(myGlobalvalues);

    frrequest.on('value', (snapshot) => {
        const data = snapshot.val();
        requestupdate(data) ;
        console.log(data);
    });

    frresponse.on('value', (snapshot) => {
        const data = snapshot.val();
        reponseupdate(data) ;

        let resposemsg = JSON.parse(data);


        setSensors(resposemsg.Sensors);

       // console.log(data);
    });


    


  }, []);


    return(
        <div>
            <h2>about Page</h2>
            

            {Sensordisplay(msensorsarray,true)}

            <div key="sdaff">
            <h3 >request : {reqvlaue} </h3>

            <h3 >response : {repvalue} </h3>
            

            <div className="out_button">
             <button className="button_on" onClick={() => sendfirebase()}>메시지전달</button> 
            </div>

            </div>
        </div>
    );
}

export default About;