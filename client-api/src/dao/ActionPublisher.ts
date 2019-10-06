import { Redis } from "ioredis";

export interface Action {
    id: string;
    type: 'calibrate';
    target: 'zero' | 'empty' | 'full';
}

export class ActionPublisher {
    constructor(private redis: Redis, private channel: string) {
    }

    async sendAction(action: Action): Promise<void> {
        await this.redis.publish(this.channel, JSON.stringify(action));
    }
}