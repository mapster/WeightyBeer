const path = require('path');
const SerialPort = require("serialport");
const config = require(path.resolve(process.argv[2] || './config.json'));

const configError = isInvalidConfig(config);
if (configError) {
    console.error(configError);
    process.exit(1);
}

const serialport = new SerialPort(config.serialport, {
  baudRate: 9600,
  parser: SerialPort.parsers.readline('\n')
});

serialport.on('open', function(){
  console.log('Serial Port Opend');
  serialport.on('data', arduinoListener);
});

function arduinoListener(rawData) {
  const trimmedData = rawData.trim();
  const type = trimmedData.substring(0, trimmedData.indexOf(':'));
  const data = trimmedData.substring(trimmedData.indexOf(':') + 1).trim();

  switch (type) {
    case 'msg':
      processMsg(data);
      break;
    case 'err':
      processError(data);
      break;
    default:
      processData(trimmedData);
  }
}

function processData(data) {
  const splitAt = data.indexOf(':');
  const id = Number.parseInt(data.substring(0, splitAt));
  const value = data.substring(splitAt+1);

  if(Number.isInteger(id)) {
  console.log(config.sensors[id].id + ": " + value);
  } else {
    console.log('Unprocessable data received: ' + data);
  }
}

function processMsg(msg) {
  if (msg == 'ready') {
    console.log("Arduino ready: sending sensor config");
    sendConfig();
  } else if (msg.startsWith('Listening')) {
    console.log("Arduino configured: " + msg);
  } else {
    console.error('Unknown message received: ' + msg);
  }
}

function processError(error) {
  console.error('Error received from arduino: ' + error);
  process.exit(1);
}

function sendConfig() {
  const sensorConfig = config.sensors
      .map(s => '(' + s.outPin + ':' + s.clockPin + ')')
      .reduce( (a, b) => a + ',' + b);

  serialport.write(Buffer.from(sensorConfig + '\n'));
}

function isInvalidConfig(config) {
  if (!config.serialport) {
    return "Invalid config: no serialport specified";

  }
  if (!config.sensors || !Array.isArray(config.sensors) || config.sensors.length < 1) {
    return "Invalid config: no sensors specified";
  }
  return false;
}
