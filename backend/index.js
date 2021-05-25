
var express = require("express");
var app = express();
var cors = require("cors");
const MainAPI = require("./maintask.js");


const hostname = "127.0.0.1";
const port = 3133;



app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
    res.send('indoor farm express start..');
  });
  
app.use("/api/getsensorstatus", function (req, res) {
    MainAPI.postapi(req,res);
  });
  
 
  
var server = app.listen(port, function () {
  console.log("Node server is running..");
});


setTimeout(MainAPI.maintask, 1000);