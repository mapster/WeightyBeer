const firebase = require('firebase');
const config = require('../firebase-config');
const sensorListener = require('./sensorListener');
const registerSensors = require('./registerSensors');
const actionHandler = require('./actionhandlers');

firebase.initializeApp(config);

var database = firebase.database();
const actionsRef = database.ref('weighthub/actions');
const weightsRef = database.ref('weighthub/weights');
const sensorsRef = database.ref('sensors/weight');

sensorsRef.on('child_added', (sensor) => registerSensors(weightsRef, sensorListener, sensor));
actionsRef.on('child_added', (action) => actionHandler(weightsRef, sensorsRef, action));
