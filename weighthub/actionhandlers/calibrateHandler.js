function calibrate(weightsRef, sensorsRef, action) {
  const {id, target} = action;
  let valRef = sensorsRef.child(id + '/value');
  let weightRef = weightsRef.child(id);

  switch (target) {
    case 'zero':
      valRef.once('value', function(zeroSnap) {
        const zero = zeroSnap.val();
        console.log('Calibrating ' + id + ' zero as: ' + zero);
        weightRef.child('zero').set(zero);
      });
      break;
    case 'full':
      valRef.once('value', function(fullSnap) {
        const full = fullSnap.val()
        console.log('Calibrating ' + id + ' full as: ' + full);
        weightRef.child('/full').set(full);
      });
      break;
    case 'empty':
      valRef.once('value', function(emptySnap) {
        const empty = emptySnap.val();
        console.log('Calibrating ' + id + ' empty as: ' + empty);
        weightRef.child('/empty').set(empty);
      });
      break;
    default:
      console.log('Unknown calibration target: ' + target);
  }
}

module.exports = calibrate;
