const fs = require('fs');
const Outputdevice = require("../frontend/farmapp/src/commonjs/outputdevice.js");

module.exports = class AutoControl {

    static Writefile(filename, mautolist)
    {
        let data = JSON.stringify(mautolist);
        fs.writeFileSync(filename, data);

    }
    static  Readfile(filename)
    {

        let rawdata = fs.readFileSync(filename);
        let objlist = JSON.parse(rawdata);

        let alist=[];
        objlist.forEach(element => {
            alist.push(Object.assign(new AutoControl(), element));
        });

        return alist;

    }




    constructor() {
      
    this.pwmcontrolenable=true;
      this.pwmonoffstatus=false;
      this.pwmontime=5;
      this.pwmofftime=10;
      this.pwmontime_count=0;
      this.pwmofftime_count=0;



      //자동제어 고유id 자동생성
      this.uniqid= "AID"+ Math.random().toString(36).substr(2, 16);
      
      this.myonoffstate=false;
      
      


      this.enabled=false;
      this.name = "자동제어";
      this.starttime = 0;// 시작시간
      this.endtime = 8900;    // 종료시간
      this.devids=[];
      this.priority=0;
      this.istimer=false;

      this.sensorid="";
      this.onvalue=0;
      this.offvalue=0;

      this.condition="up";
      
      this.onetime_run=60;
      this.onetime_idle=60;


      



      
    }
    //test
    controlbypwm()
    {

        let mstatus=true;

        if(this.pwmcontrolenable== true )
        {
            if(mstatus ==true)
            {
                if(this.pwmonoffstatus ==true)
                {
                    this.pwmontime_count++;
                    if(this.pwmontime_count >=this.pwmontime)
                    {
                        this.pwmofftime_count=0;
                        this.pwmonoffstatus=false;
                    }
                    mstatus=true;
                }
                else{

                    this.pwmofftime_count++;
                    if(this.pwmofftime_count >=this.pwmofftime)
                    {
                        this.pwmontime_count=0;
                        this.pwmonoffstatus=true;
                    }

                    mstatus=false;
                }
            }
        }

        return mstatus;

    }
    controlbytimer()
    {
        return true;
    }
    controlbysensor(msensors)
    {
        let mstatus=null;

        for(const ms of msensors)
        {
            if(ms.UniqID === this.sensorid)
            {
                if(this.condition  =="up")
                {
                    if(ms.value > this.onvalue)
                    {
                        mstatus=true;
                    }
                    else 
                    {
                        if(ms.value <  this.offvalue)
                        {
                            mstatus=false;
                        }
                    }


                }
                else{
                    if(ms.value < this.onvalue)
                    {
                        mstatus=true;
                    }
                    else 
                    {
                        if(ms.value >  this.offvalue)
                        {
                            mstatus=false;
                        }
                    }

                }

                break;
            }
        }


        return mstatus;
    }
    controlcheckbytime(msensors, timesecnow)
    {
        let mstatus=false;

        if(timesecnow>=  this.starttime && timesecnow < this.endtime)
        {
            if(this.istimer ===true)
            {
                mstatus=this.controlbytimer();
            }
            else if(this.pwmcontrolenable=== true)
            {
                mstatus=this.controlbypwm();

            }
            else{

                mstatus=this.controlbysensor(msensors);

            }

            

        }
        else{
            mstatus=false;
            
        }

       if(mstatus !=null)
       {

            if(this.myonoffstate !=mstatus)
            {
                this.myonoffstate=mstatus;
                

                return true;
            }
        }


        return false;

    }

    
    
  };
  