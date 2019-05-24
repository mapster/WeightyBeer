import { Redis } from "ioredis";
import { Image } from "../api/schema/Image";

export abstract class RedisRepository {
    private readonly redis: Redis;

    constructor(redis: Redis) {
        this.redis = redis;
    }

    protected async newId(counterKey: string): Promise<string> {
        const id = await this.redis.incr(counterKey);
        return `${id}`
    }

    protected abstract asDbId(id: string): string;

    protected fromDbId(dbId: string): string {
        return dbId.split(":")[1];
    }

    protected async scanKeys(pattern: string) {
        const keys: string[] = [];

        let cursor = "0", currentKeys: string[] = [];
        do {
            [cursor, currentKeys] = await this.redis.scan(parseInt(cursor), "match", pattern);
            currentKeys.forEach(k => keys.push(k));
        } while (cursor !== "0")

        return keys;
    }

    protected getFieldValues(id: string): Promise<FieldMap> {
        return this.redis.hgetall(this.asDbId(id));
    }

    protected async exists(id: string): Promise<boolean> {
        return (await this.redis.exists(this.asDbId(id))) === 1
    }

    protected async set(id: string, data: FieldMap): Promise<boolean> {
        // it does really return a string.
        return (await this.redis.hmset(this.asDbId(id), data) as unknown as string) === "OK";
    }

    protected del(id: string): Promise<number> {
        return this.redis.del(this.asDbId(id));
    }
}