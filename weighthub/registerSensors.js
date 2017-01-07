const quantize = require('./quantizer');
function registerSensors(weightsRef, sensorListener, sensorSnapshot) {
  var sensor = sensorSnapshot.val();
  console.log('Registered new sensor: ' + sensor.id);
  const weightRef = weightsRef.child(sensor.id);
  weightRef.child('id').set(sensor.id);
  weightRef.update({
    id: sensor.id,
    current: quantize(sensor.value)
  });

  sensorSnapshot.ref.on('value', (newSnapshot) => sensorListener(weightRef, newSnapshot.val()));
}

module.exports = registerSensors;
