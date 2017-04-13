const path = require('path');
const firebase = require('firebase-admin');
const firebaseConfig = require('../firebase-config');
const credentials = require('../credentials');
const WeightyArduino = require("./WeightyArduino");
const config = require(path.resolve(process.argv[2] || './config.json'));

const configCred = Object.assign(
  {
    credential: firebase.credential.cert(credentials),
    databaseAuthVariableOverride: {
      uid: 'weighthub'
    },
  },
  firebaseConfig
)

firebase.initializeApp(configCred);
const database = firebase.database();
const sensorsRef = database.ref('sensors/weight');

const weigthyArduino = new WeightyArduino(config);
weigthyArduino.addDataListener(pushToFirebaseListener);
// weigthyArduino.addDataListener(consoleListener);
weigthyArduino.startListening();

function pushToFirebaseListener(id, value, initialize = false) {
  if (initialize) {
    sensorsRef.child(id).update({id, value});
  } else {
    sensorsRef.child(id + '/value').set(value);
  }
}

function consoleListener(id, value, initialize = false) {
  if (!initialize) {
    console.log(value);
  }
}
