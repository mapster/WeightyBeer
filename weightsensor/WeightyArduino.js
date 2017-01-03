const SerialPort = require("serialport");

module.exports = class WeighthArduino {

  constructor(config) {
    this.dataListeners = [];
    this.config = config;

    const configError = this.isInvalidConfig(this.config);
    if (configError) {
      throw configError;
    }
  }

  startListening() {
    this.connection = new SerialPort(this.config.serialport, {
      baudRate: 9600,
      parser: SerialPort.parsers.readline('\n')
    });

    this.connection.on('open', function(){
      console.log('Connected to arduino');
      this.connection.on('data', this.arduinoListener.bind(this));
    }.bind(this));
  }

  addDataListener(listener) {
    this.dataListeners.push(listener);
    this.config.sensors.forEach(s => listener(s.id, 0, true));
  }

  arduinoListener(rawData) {
    const trimmedData = rawData.trim();
    const type = trimmedData.substring(0, trimmedData.indexOf(':'));
    const data = trimmedData.substring(trimmedData.indexOf(':') + 1).trim();

    switch (type) {
      case 'msg':
        this.processMsg(data);
        break;
      case 'err':
        this.processError(data);
        break;
      default:
        this.processData(trimmedData);
    }
  }

  processData(data) {
    const splitAt = data.indexOf(':');
    const id = Number.parseInt(data.substring(0, splitAt));
    const value = data.substring(splitAt+1);

    if(Number.isInteger(id)) {
      this.dataListeners.forEach(l => l(this.config.sensors[id].id, value));
    } else {
      console.log('Unprocessable data received: ' + data);
    }
  }

  processMsg(msg) {
    if (msg == 'ready') {
      console.log("Arduino ready: sending sensor config");
      this.sendConfig();
    } else if (msg.startsWith('Listening')) {
      console.log("Arduino configured: " + msg);
    } else {
      console.error('Unknown message received: ' + msg);
    }
  }

  processError(error) {
    throw 'Error received from arduino: ' + error;
  }

  sendConfig() {
    const sensorConfig = this.config.sensors
    .map(s => '(' + s.outPin + ':' + s.clockPin + ')')
    .reduce( (a, b) => a + ',' + b);

    this.connection.write(Buffer.from(sensorConfig + '\n'));
  }

  isInvalidConfig(config) {
    if (!config.serialport) {
      return "Invalid config: no serialport specified";

    }
    if (!config.sensors || !Array.isArray(config.sensors) || config.sensors.length < 1) {
      return "Invalid config: no sensors specified";
    }
    return false;
  }
}
