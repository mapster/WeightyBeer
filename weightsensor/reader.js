const path = require('path');
const WeightyArduino = require("./WeightyArduino");
const config = require(path.resolve(process.argv[2] || './config.json'));

const weigthyArduino = new WeightyArduino(config);
weigthyArduino.startListening();
