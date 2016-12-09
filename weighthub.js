var firebase = require('firebase');
var config = require('./firebase-config');

firebase.initializeApp(config);

var database = firebase.database();

function sensorListener(weightRef, sensor) {
  console.log(sensor.id + ": " + sensor.value);
  weightRef.once('value').then(function (weightSnap) {
    let weight = weightSnap.val();
    let one = weight.empty - weight.full;
    let part = weight.empty - weight.current;
    console.log(part + " / " + one);
    weightRef.update({
      current: sensor.value,
      percent: part / one
    });
  });
}

function registerSensors(sensorSnapshot) {
  var sensor = sensorSnapshot.val();
  console.log('Registered new sensor: ');
  console.log(sensor);
  const weightRef = database.ref('weighthub/weights/' + sensor.id);

  sensorSnapshot.ref.on('value', (sensorSnapshot) => {
    const sensor = sensorSnapshot.val();
    weightRef.child('id').set(sensor.id)
    return sensorListener(weightRef, sensor);
  });
}

function calibrate(calibrate) {
  let valRef = database.ref('sensors/weight/' + calibrate.id + '/value');
  let weightRef = database.ref('weighthub/weights/' + calibrate.id);
  switch (calibrate.target) {
    case 'zero':
      valRef.once('value', function(zero) {
        console.log('Calibrating ' + calibrate.id + ' zero as: ' + zero);
        weightRef.child('zero').set(zero.val());
      });
      break;
    case 'full':
      valRef.once('value', function(full) {
        console.log('Calibrating ' + calibrate.id + ' full as: ' + full);
        weightRef.child('/full').set(full.val());
      });
      break;
    case 'empty':
      valRef.once('value', function(empty) {
        console.log('Calibrating ' + calibrate.id + ' empty as: ' + empty);
        weightRef.child('/empty').set(empty.val());
      });
      break;
    default:
      console.log('Unknown calibration target: ' + calibrate.target);
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
