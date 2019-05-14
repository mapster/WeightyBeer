const path = require('path');
const WeightyArduino = require("./WeightyArduino");
const FirebasePublisher = require('./firebasePublisher');
const RedisPublisher = require('./redisPublisher');
const config = require(path.resolve(process.argv[2] || './config.json'));

const weigthyArduino = new WeightyArduino(config);

if(Array.isArray(config.publishers)) {
  config.publishers.forEach(pub => createPublisher(pub));
} else {
  throw 'Invalid config: publishers is not an array';
}

weigthyArduino.startListening();

function createPublisher(publisherConfig) {
  if (publisherConfig.firebase) {
    weigthyArduino.addDataListener(new FirebasePublisher(publisherConfig.firebase).createPublisher());
  } else if (publisherConfig.console) {
    weigthyArduino.addDataListener(consoleListener);
  } else if (publisherConfig.redis) { 
    weigthyArduino.addDataListener(new RedisPublisher(publisherConfig.redis).createPublisher());
  } else {
    throw 'Invalid config: Unknown publisher - publisherConfig';
  }
}

function consoleListener(id, value, initialize = false) {
  if (!initialize) {
    console.log(value);
  }
}
