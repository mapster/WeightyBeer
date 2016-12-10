function sensorListener(weightRef, sensor) {
  weightRef.once('value').then(function (weightSnap) {
    let weight = weightSnap.val();
    let one = weight.empty - weight.full || 1;
    let part = weight.empty - weight.current || 1;
    // console.log(part + " / " + one);
    weightRef.update({
      current: sensor.value,
      percent: Math.round((part / one) * 100),
    });
  });
};

module.exports = sensorListener;
