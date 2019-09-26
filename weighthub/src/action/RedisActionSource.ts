import { ActionSource } from "./ActionSource";
import { WeightHub, Action } from "../WeightHub";
import Redis from 'ioredis';

export class RedisActionSource implements ActionSource {

    private channel: string;
    private client: Redis.Redis;

    constructor(channel: string, redisConfig?: Redis.RedisOptions) {
        this.channel = channel;
        this.client = new Redis(redisConfig);
    }

    start(weightHub: WeightHub): void {
        this.client.on('message', (channel, message) => {
            if (message) {
                const action: Action = JSON.parse(message);
                weightHub.doAction(action);
            }
        });

        this.client.subscribe(this.channel);
    }
}