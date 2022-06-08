



var firebaseConfig = {
  apiKey: "AIzaSyAmiscjBV0mf4O4kdG_aK7T4J6Jd7RrJeE",
  authDomain: "indoorfarm-6f7b8.firebaseapp.com",
  databaseURL: "https://indoorfarm-6f7b8-default-rtdb.firebaseio.com/",
  projectId: "indoorfarm-6f7b8",
  storageBucket: "indoorfarm-6f7b8.appspot.com",
  messagingSenderId: "141091391091",
  appId: "1:141091391091:web:4f2005e37d6c8fbde24c06",
  measurementId: "G-8JM4DB8X77"
};




module.exports = class KDCommon {

  static  getFoodJukebox_Productid()
  {
    return  0xFC21;
  }
   

  static delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      static getFirebaseDB()
      {
        const firebaseR = require("firebase");

        //console.log(firebase);

        if (!firebaseR.apps.length)
        {
          firebaseR.initializeApp(firebaseConfig);
        }
        return firebaseR.database();

      }

   


     

      
}