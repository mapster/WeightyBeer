import { Redis } from "ioredis";
import { CalibrationTarget } from "../api/schema/Weight";

export interface Action {
    id: string;
    type: 'calibrate' | 'customCalibration';
    target: CalibrationTarget;
    value?: number;
}

export class ActionPublisher {
    constructor(private redis: Redis, private channel: string) {
    }

    async sendAction(action: Action): Promise<void> {
        await this.redis.publish(this.channel, JSON.stringify(action));
    }
}