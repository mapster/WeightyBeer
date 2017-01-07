const quantize = require('./quantizer');

function sensorListener(weightRef, sensor) {
  const quantized = quantize(sensor.value) || 1;
  weightRef.once('value').then(function (weightSnap) {
    const weight = weightSnap.val() || 1;
    const avg = Math.floor((weight.current + quantized) / 2);
    const one = weight.empty - weight.full || 1;
    const part = weight.empty - avg || 1;
    const percent = Math.min(100, Math.floor((part / one) * 100));

    weightRef.update({
      current: avg,
      percent,
    });
  });
};

module.exports = sensorListener;
