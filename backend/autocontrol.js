
module.exports = class AutoControl {
    constructor(starttime,endtime,hchannel) {
      this.Name = "nuknown";
      this.hwchannel = hchannel;
      this.starttime_sec = starttime;
      this.endtime_sec = endtime;
      this.enabled=false;
      this.myonoffstate=false;
      this.pwmcontrolenable=true;
      this.pwmonoffstatus=false;
      this.pwmontime=5;
      this.pwmofftime=10;
      this.pwmontime_count=0;
      this.pwmofftime_count=0;
      
    }
    controlcheckbytime(timesecnow)
    {
        let mstatus=false;

        if(timesecnow>=  this.starttime_sec && timesecnow < this.endtime_sec)
        {
            mstatus=true;

        }
        else{
            mstatus=false;
            
        }

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

        if(this.myonoffstate !=mstatus)
        {
               this.myonoffstate=mstatus;
               return true;
         }
        return false;

    }
    
  };
  