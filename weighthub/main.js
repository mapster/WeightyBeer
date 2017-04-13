const firebase = require('firebase-admin');
const config = require('../firebase-config');
const credentials = require('../credentials.json');
const sensorListener = require('./sensorListener');
const registerSensors = require('./registerSensors');
const actionHandler = require('./actionhandlers');

const configCred = Object.assign(
  {
    credential: firebase.credential.cert(credentials),
    databaseAuthVariableOverride: {
      uid: 'weighthub'
    },
  },
  config
);
firebase.initializeApp(configCred);

var database = firebase.database();
const actionsRef = database.ref('weighthub/actions');
const weightsRef = database.ref('weighthub/weights');
const sensorsRef = database.ref('sensors/weight');
sensorsRef.on('child_added', (sensor) => registerSensors(weightsRef, sensorListener, sensor));
actionsRef.on('child_added', (action) => actionHandler(weightsRef, sensorsRef, action));
