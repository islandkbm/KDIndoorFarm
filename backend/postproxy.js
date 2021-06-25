var io = require("socket.io-client");
var net = require("net");
const KDCommon = require("../frontend/farmapp/src/commonjs/kdcommon");

const serverip = "192.168.10.21";
const serverport = 3130;

module.exports = async function postproxytask() {
  let ncount = 0;
  let isconnect = false;

  while (true) {
    if (isconnect === false) {
      try {
        const socketClient = new net.Socket();

        socketClient.connect(serverport, serverip, function () {
          isconnect = true;
          console.log("socket connected");
        });

        socketClient.on("close", function () {
          console.log("Connection closed");
          isconnect = false;
        });

        socketClient.on("error", function (err) {
          console.error("Connection error: " + err);
          isconnect = false;
        });

        socketClient.on('data', function(data) {
            console.log('Received: ' + data);
            socketClient.send("hahahha");
           
            });


        await KDCommon.delay(1000);

        //console.log(socketClient);
      } catch (error) {
        console.log("postproxytask : catch...... ");
        console.log(error);

        //    throw error;
      }
    }

    console.log("postproxytask : " + ncount++);
    await KDCommon.delay(1000);
  }
};
