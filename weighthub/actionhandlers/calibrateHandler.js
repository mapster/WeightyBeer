const quantize = require('../quantizer');
const TARGETS = ['zero', 'full', 'empty'];

function calibrate(weightsRef, sensorsRef, action) {
  const {id, target} = action;
  let valRef = sensorsRef.child(id + '/value');
  let weightRef = weightsRef.child(id);

  if(TARGETS.includes(target)) {
    weightRef.once('value', weightSnap => {
      const current = weightSnap.val().current;
      console.log('Calibrating ' + id + ' ' + target + ' as: ' + current);
      if (current) {
        weightRef.child(target).set(current);
      }
    });
  } else {
    console.log('Unknown calibration target: ' + target);
  }
}

module.exports = calibrate;
