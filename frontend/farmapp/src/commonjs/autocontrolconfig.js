const fs = require('fs');


module.exports = class AutoControlconfig {

    static deepcopy(mobj) {
        return Object.assign(new AutoControlconfig(), mobj);
      }

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
            alist.push(Object.assign(new AutoControlconfig(), element));
        });

        return alist;

    }


    constructor() {
      
          


      //자동제어 고유id 자동생성
      this.uniqid= "AID"+ Math.random().toString(36).substr(2, 16);
     

      this.category=0;

      this.enabled=false;
      this.name = "자동제어";
      this.starttime = 0;// 시작시간
      this.endtime = 24*3600;    // 종료시간
      this.devids=[];
      this.priority=0;
      this.istimer=true;

      this.sensorid="";
      this.onvalue=0;
      this.offvalue=0;

      this.condition="up";
      
      this.onetime_run=60;
      this.onetime_idle=60;
     

      this.pwmcontrolenable=false;
      this.pwmontime=5;
      this.pwmofftime=10;
      
    }
   

    
    
  };
  