



const KDSensorTypeEnum = Object.freeze(
    {

        SUT_None: 0,
        SUT_Temperature: 1,           //공기온도
        SUT_Humidity: 2,
        SUT_SoilTemperature: 3,
        SUT_SoilMoisture: 4,
        SUT_SoilEC: 5,
        SUT_CO2: 6,
        SUT_WTemperature: 7, ///배지온도
        SUT_SoraRadiation: 8,
        SUT_WINDSPEED: 9,
        SUT_WINDVANE: 10,
        SUT_BAROMETER: 11,
        SUT_PRESSURE: 12,
        SUT_RAINGUAGE: 13,
        SUT_RAINDETECTOR: 14,
        SUT_UV: 15,

        SUT_PE300_PH: 16,                           ///
        SUT_PE300_EC: 17,
        SUT_PE300_TEMP: 18,

        SUT_CO1: 19, //Co  센서
        SUT_O2: 20, //산소 센서

        SUT_LIGHT: 21, //SMBL 조도 센서

        SUT_COLOR_RED: 22, //SMBL 컬러센서 Red   n 0~100000
        SUT_COLOR_GREEN: 23, //SMBL 컬러센서 Green  n  0~100000
        SUT_COLOR_BLUE: 24, //SMBL 컬러센서 Blue  n 0~100000

        SUT_AMMONIA: 25, //암모니아 센서 ppm  0~1000
        SUT_FLOWMETER: 26, //유량계  L/min    0.01~1000.00
        SUT_FLOWMETER_TOTAL: 27, //적산 유량계  L    0.1~10000.0

        SUT_BATTRY: 28, //베터리 레벨  Battery %   0~100 %
        SUT_WEIGHT_KG: 29, //무게  Weght kg   0.001 소수점 3자리
        SUT_WATER_MM: 30, //수위      mm  1~10000mm

        SUT_DO_MG: 31, //용존산소량  ( DO)    0~20 mg/L  소수점 2자리

        SUT_SoilBulkEC: 32, // 토양 벌크 EC
        SUT_Counter: 33, //  단순계수기

        SUT_H2S: 34, //  황화수소
        SUT_PM25: 35, //  초미세먼지
        SUT_PM10: 36, //  미세먼지
        SUT_C1H4: 37, //  매탄
        SUT_C2H6: 38, //  에탄
        SUT_C3H6: 39, // 프로판
        SUT_SOLARMJ: 40,// MJ/m2    누적일사량    메가 줄  소수점 3자리
        SUT_DEWPOINT: 41,// ℃   이슬점     소스점 1자리

    });



 class Sensordevice{
        static Clonbyjsonobj(mobj)
        {
            return new Sensordevice(mobj.nodeID,mobj.SensorCode, mobj.value, mobj.status,mobj.errorcount);
        }
    
        constructor(nodeid, sensorcode,sensorvalue,sensorstatus, errorcount=0) {
    
    
            let hwchannel = (sensorcode >> 8) & 0xff;
            let sensortype = sensorcode & 0xff;

            this.nodeID = nodeid;
            this.Name = "sensor";
            this.ValueUnit = " ";
            this.SignificantDigit = 3;
            this.channel = hwchannel;
            this.value = sensorvalue;//Buffer.from([(repdatas[0] >> 0) & 0xFF, (repdatas[0] >> 8) & 0xFF, (repdatas[1] >> 0) & 0xFF, (repdatas[1] >> 8) & 0xFF]).readFloatLE(0);
            this.status =sensorstatus;// repdatas[2];
            this.Sensortype = sensortype;
            this.SensorCode = sensorcode;
            this.UniqID = "S"+nodeid+"C"+sensorcode; // 센서를 구별하는 고유ID  센서노드와 채널 타입정보로 생성한다. S11C123
            this.errorcount=errorcount;

            switch (this.Sensortype) {
                case KDSensorTypeEnum.SUT_Temperature: this.ValueUnit = "℃"; this.Name = "온도"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_Humidity: this.ValueUnit = "%"; this.Name = "습도"; this.SignificantDigit = 0; break;
                case KDSensorTypeEnum.SUT_SoilTemperature: this.ValueUnit = "℃"; this.Name = "토양온도"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_SoilMoisture: this.ValueUnit = "%vol."; this.Name = "토양함수율"; this.SignificantDigit = 1; break;
    
                case KDSensorTypeEnum.SUT_SoilEC: this.ValueUnit = "dS/m"; this.Name = "토양EC"; this.SignificantDigit = 2; break;
                case KDSensorTypeEnum.SUT_CO2: this.ValueUnit = "ppm"; this.Name = "이산화탄소"; this.SignificantDigit = 0; break;
                
    
                case KDSensorTypeEnum.SUT_WTemperature: this.ValueUnit = "℃"; this.Name = "배지온도"; this.SignificantDigit = 1; break;
    
    
                case KDSensorTypeEnum.SUT_SoraRadiation: this.ValueUnit = "W/m2"; this.Name = "일사"; this.SignificantDigit = 1; break;
    
                case KDSensorTypeEnum.SUT_WINDSPEED: this.ValueUnit = "°"; this.Name = "풍향"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_WINDVANE: this.ValueUnit = "m/s"; this.Name = "풍속"; this.SignificantDigit = 1; break;
    
                case KDSensorTypeEnum.SUT_BAROMETER: this.ValueUnit = "hPa"; this.Name = "대기압"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_PRESSURE: this.ValueUnit = "hPa"; this.Name = "압력"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_RAINGUAGE: this.ValueUnit = "mm"; this.Name = "강우량"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_RAINDETECTOR: this.ValueUnit = " "; this.Name = "강우감지"; this.SignificantDigit = 1; break;
    
                case KDSensorTypeEnum.SUT_UV: this.ValueUnit = ""; this.Name = "UV"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_PE300_PH: this.ValueUnit = " "; this.Name = "pH"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_PE300_EC: this.ValueUnit = "dS/m"; this.Name = "EC"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_PE300_TEMP: this.ValueUnit = "℃"; this.Name = "PE300온도"; this.SignificantDigit = 1; break;
    
                case KDSensorTypeEnum.SUT_CO1: this.ValueUnit = "ppm"; this.Name = "일산화탄소"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_O2: this.ValueUnit = "%"; this.Name = "산소"; this.SignificantDigit = 2; break;
                case KDSensorTypeEnum.SUT_LIGHT: this.ValueUnit = "Lux"; this.Name = "조도"; this.SignificantDigit = 0; break;
                case KDSensorTypeEnum.SUT_COLOR_RED: this.ValueUnit = " "; this.Name = "RED"; this.SignificantDigit = 0; break;
                case KDSensorTypeEnum.SUT_COLOR_GREEN: this.ValueUnit = " "; this.Name = "GREEN"; this.SignificantDigit = 0; break;
                case KDSensorTypeEnum.SUT_COLOR_BLUE: this.ValueUnit = " "; this.Name = "BLUE"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_AMMONIA: this.ValueUnit = "ppm"; this.Name = "암모니아"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_FLOWMETER: this.ValueUnit = "L/min"; this.Name = "유량"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_FLOWMETER_TOTAL: this.ValueUnit = "L"; this.Name = "적산유량"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_BATTRY: this.ValueUnit = "%"; this.Name = "베터리"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_WEIGHT_KG: this.ValueUnit = "kg"; this.Name = "무게"; this.SignificantDigit = 3; break;
                case KDSensorTypeEnum.SUT_WATER_MM: this.ValueUnit = "mm"; this.Name = "수위"; this.SignificantDigit = 1; break;
                case KDSensorTypeEnum.SUT_DO_MG: this.ValueUnit = "mg/L"; this.Name = "용존산소량"; this.SignificantDigit = 2; break;
                case KDSensorTypeEnum.SUT_SoilBulkEC: this.ValueUnit = "dS/m"; this.Name = "벌크EC"; this.SignificantDigit = 2; break;
                case KDSensorTypeEnum.SUT_Counter: this.ValueUnit = "N"; this.Name = "계수기"; this.SignificantDigit = 0; break;
                case KDSensorTypeEnum.SUT_H2S: this.ValueUnit = "ppm"; this.Name = "황화수소"; this.SignificantDigit = 2; break;
                case KDSensorTypeEnum.SUT_PM25: this.ValueUnit = "ug"; this.Name = "초미세먼지"; this.SignificantDigit = 2; break;
                case KDSensorTypeEnum.SUT_PM10: this.ValueUnit = "ug"; this.Name = "미세먼지"; this.SignificantDigit = 2; break;
                case KDSensorTypeEnum.SUT_C1H4: this.ValueUnit = "ppm"; this.Name = "메탄"; this.SignificantDigit = 2; break;
                case KDSensorTypeEnum.SUT_C2H6: this.ValueUnit = "ppm"; this.Name = "에탄"; this.SignificantDigit = 2; break;
                case KDSensorTypeEnum.SUT_C3H6: this.ValueUnit = "ppm"; this.Name = "프로판"; this.SignificantDigit = 2; break;
                case KDSensorTypeEnum.SUT_SOLARMJ: this.ValueUnit = "J/cm2"; this.Name = "누적일사량"; this.SignificantDigit = 3; break;
                case KDSensorTypeEnum.SUT_DEWPOINT: this.ValueUnit = "℃"; this.Name = "이슬점"; this.SignificantDigit = 1; break;
                default:
                    this.ValueUnit = " "; this.Name = "신규센서"; this.SignificantDigit = 1; 
                    break;
    
            }
    
            this.valuestring = this.GetValuestring(false,false);
    
    
    
        }

    //  console.log("SensorDevice  : " + this.value );


    //센서값을 문자열로표시 표시
    GetValuestring(isWithname, isWithunit){

        let strvalue = "";

        if (isWithname == true) {

            strvalue += this.Name + " ";
        }

        strvalue += this.value.toFixed(this.SignificantDigit);
        if (isWithunit == true) {
            strvalue += " " + this.ValueUnit;
        }

        return strvalue;

    }



}


module.exports = Sensordevice;

