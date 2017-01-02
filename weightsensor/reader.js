var SerialPort = require("serialport");
var serialport = new SerialPort("/dev/ttyACM0", {
  parser: SerialPort.parsers.readline('\n')
});

serialport.on('open', function(){
  console.log('Serial Port Opend');
  serialport.on('data', function(data){
    if(data.trim() == "msg: ready") {
      serialport.write(Buffer.from("(2:3)\n"));
    }
    console.log(data);
  });
});
