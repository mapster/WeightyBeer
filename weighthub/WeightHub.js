const quantize = require('./quantizer');

module.exports = class WeightHub {

    constructor(weightHubRef) {
        this.weightHubRef = weightHubRef;
    }

    registerSensor(sensor) {
        console.log('Registered new sensor: ' + sensor.id);

        const weightRef = this.getWeightRef(sensor.id);
        weightRef.update({
            id: sensor.id,
            current: quantize(sensor.value)
        });
    }

    updateSensor(sensor) {
        const quantized = quantize(sensor.value) || 1;

        const weightRef = this.getWeightRef(sensor.id);
        weightRef.once('value').then((weightSnap) => {
            const weight = weightSnap.val() || 1;
            const avg = Math.floor((weight.current + quantized) / 2);
            const one = weight.full - weight.empty || 1;
            const part = avg - weight.empty || 1;
            const percent = Math.min(100, Math.floor((part / one) * 100));
        
            weightRef.update({
              current: avg,
              percent,
            });
          });
    }

    getWeightRef(id) {
        return this.weightHubRef.child(id);
    }
}
