


 class responseMessage{
    
    constructor()
    {
        let today = new Date(); 
        this.datetime=today.toLocaleString();//응답된 날자+시간
        this.Sensors=[];
        this.Outputs=[];
        this.AutoStatus=[];
        this.AutoControls=[];
        this.IsOK=false; ///요청을 정상적으로 처리했으면 true
    }

}
module.exports = responseMessage;