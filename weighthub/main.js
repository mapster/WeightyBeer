const firebase = require('firebase-admin');
const WeightHub = require('./WeightHub');
const RedisListener = require('./RedisListener');
const actionHandler = require('./actionhandlers');

const config = require('../firebase-config');
const credentials = require('../credentials.json');
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
const weightHub = new WeightHub(weightsRef);

const source = process.argv[2];
if (source === 'firebase') {
  const sensorsRef = database.ref('sensors/weight');
  sensorsRef.on('child_added', (sensorSnapshot) => {
    weightHub.registerSensor(sensorSnapshot.val());
    sensorSnapshot.ref.on('value', (newSnapshot) => weightHub.updateSensor(newSnapshot.val()));
  });
} else if (source === 'redis') {
  const redisListener = new RedisListener(weightHub);
  redisListener.start();
} else {
  throw 'Invalid source given: ' + source;
}

actionsRef.on('child_added', (action) => actionHandler(weightsRef, sensorsRef, action));
