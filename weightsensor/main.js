const path = require('path');
const firebase = require('firebase');
const firebaseConfig = require('../firebase-config');
const WeightyArduino = require("./WeightyArduino");
const config = require(path.resolve(process.argv[2] || './config.json'));

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const sensorsRef = database.ref('sensors/weight');

const weigthyArduino = new WeightyArduino(config);
weigthyArduino.addDataListener(pushToFirebaseListener);
weigthyArduino.startListening();

function pushToFirebaseListener(id, value, initialize = false) {
  if (initialize) {
    sensorsRef.child(id).update({id, value});
  } else {
    sensorsRef.child(id + '/value').set(value);
  }
}
