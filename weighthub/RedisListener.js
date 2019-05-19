const redis = require("redis");

function onMessage(registeredSensors, weightHub, channel, message) {
    if (message) {
        const sensor = JSON.parse(message);

        if (registeredSensors[sensor.id]) {
            weightHub.updateSensor(sensor);
        } else {
            registeredSensors[sensor.id] = true;
            weightHub.registerSensor(sensor);
        }
    }
}

module.exports = class RedisListener {

    constructor(weightHub) {
        this.weightHub = weightHub;
        this.client = redis.createClient();
        this.registeredSensors = {};
    }

    start() {
        this.client.on('message', onMessage.bind(null, this.registeredSensors, this.weightHub));

        this.client.subscribe('sensors');
    }

}
