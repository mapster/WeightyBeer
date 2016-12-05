var firebase = require('firebase');
var config = require('./firebase-config');

firebase.initializeApp(config);

var database = firebase.database();

function sensorListener(sensorSnapshot) {
  var sensor = sensorSnapshot.val();
  console.log(sensor.id + ": " + sensor.value);
}

function registerSensors(sensorSnapshot) {
  var sensor = sensorSnapshot.val();
  console.log('Registered new sensor: ');
  console.log(sensor);
  sensorSnapshot.ref.on('value', sensorListener);
}

function calibrate(calibrate) {
  if (calibrate.target == 'zero') {
    var zero = database.ref('sensors/weight/' + calibrate.id + '/value').once('value', function(zero) {
      console.log('Calibrating ' + calibrate.id + ' zero as: ' + zero);
      database.ref('weighthub/weights/' + calibrate.id + '/zero').set(zero.val());
    });
  }
}

function doAction(actionSnap) {
  var action = actionSnap.val();
  console.log(action);
  switch (action.type) {
    case 'calibrate':
      calibrate(action);
      break;
    default:
      console.log('Unknown action requested: ' + action.type);
  }

  actionSnap.ref.remove();
}

database.ref('sensors/weight')
  .on('child_added', registerSensors);

database.ref('weighthub/actions')
  .on('child_added', doAction);
