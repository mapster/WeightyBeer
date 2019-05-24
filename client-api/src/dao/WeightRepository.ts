import { RedisRepository } from "./RedisRepository";
import { Redis } from "ioredis";
import { Weight } from "../api/schema/Weight";

const ID_COUNTER_KEY = 'counter:weight';

export class WeightRepository extends RedisRepository {

    constructor(redis: Redis) {
        super(redis);
    }

    protected asDbId(id: string): string {
        return `weight:${id}`;
    }

    async get(id: string): Promise<Weight | undefined> {
        const fieldValues = await this.getFieldValues(id);
        return Weight.fromFieldValues(fieldValues);
    }

    async getAll(): Promise<Weight[]> {
        const keys = await this.scanKeys("weight:*");
        const weights = await Promise.all(keys.map(key => this.get(this.fromDbId(key))));
        return weights as Weight[];
    }

}