import Redis from 'ioredis'
import { WeightHub, SensorReading } from "../WeightHub";
import { SensorSource } from './SensorSource';

export class RedisSensorSource implements SensorSource {
    private registeredSensors: { [key: string]: boolean } = {};
    private channel: string;
    private client: Redis.Redis;

    constructor(channel: string, redisConfig?: Redis.RedisOptions) {
        this.channel = channel;
        this.client = new Redis(redisConfig);
    }

    start(weightHub: WeightHub) {
        this.client.on('message', this.onMessage.bind(this, weightHub));

        this.client.subscribe(this.channel);
    }

    private onMessage(weightHub: WeightHub, channel: string, message: string) {
        if (message) {
            const reading: SensorReading = JSON.parse(message);

            if (this.registeredSensors[reading.id]) {
                weightHub.updateSensor(reading);
            } else {
                this.registeredSensors[reading.id] = true;
                weightHub.registerSensor(reading);
            }
        }
    }
}
