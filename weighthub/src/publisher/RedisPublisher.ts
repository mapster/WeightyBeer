import { WeightHubPublisher } from "./WeightHubPublisher";
import { Weight } from "../WeightHub";
import Redis from "ioredis";

export class RedisPublisher implements WeightHubPublisher {

    private keyPrefix: string;
    private client: Redis.Redis;

    constructor(keyPrefix: string, redisConfig?: Redis.RedisOptions) {
        this.keyPrefix = keyPrefix;
        this.client = new Redis(redisConfig);
    }

    async updateWeight(id: string, current: number, percent: number): Promise<boolean> {
        const data = {
            current,
            percent,
        };

        const success = await this.client.hmset(this.asDbId(id), data)
            .catch(reason => {
                console.error(`Redis - Failed to update weight: ${reason}`)
                return "failed";
            });

        return success === "OK";
    }

    async createWeight(id: string, current: number): Promise<boolean> {
        const data = { id, current };

        const success = await this.client.hmset(this.asDbId(id), data)
            .catch(reason => {
                console.error(`Redis - Failed to create weight: ${reason}`);
                return "failed";
            });

        return success === "OK";
    }

    async getWeight(id: string): Promise<Weight> {
        const fieldValues = await this.client.hgetall(this.asDbId(id));

        const zero = parseInt(fieldValues.zero);
        const empty = parseInt(fieldValues.empty);
        const full = parseInt(fieldValues.full);
        const current = parseInt(fieldValues.current);
        const percent = parseInt(fieldValues.percent);

        return { id, zero, empty, full, current, percent };
    }

    private asDbId(id: string) {
        return `${this.keyPrefix}:${id}`;
    }
}
