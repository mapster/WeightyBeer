function sensorListener(weightRef, sensor) {
  weightRef.once('value').then(function (weightSnap) {
    const weight = weightSnap.val();
    const one = weight.empty - weight.full || 1;
    const part = weight.empty - sensor.value || 1;
    const basisPoint = Math.round((part / one) * 10000);
    const percent = Math.min(100, basisPoint / 100);
    const diff = Math.round(Math.abs(percent - weight.percent) * 100) / 100;

    if(percent != weight.percent && diff > 0.01) {
      weightRef.update({
        current: sensor.value,
        percent,
      });
    }
  });
};

module.exports = sensorListener;
