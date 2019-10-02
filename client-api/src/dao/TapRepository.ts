import { RedisRepository } from "./RedisRepository";
import { Redis } from "ioredis";
import { Tap } from "../api/schema/Tap";

const ID_COUNTER_KEY = 'counter:tap';

export class TapRepository extends RedisRepository {

    constructor(redis: Redis) {
        super(redis);
    }

    protected asDbId(id: string): string {
        return `tap:${id}`;
    }

    async get(id: string): Promise<Tap | undefined> {
        const fieldValues = await this.getFieldValues(id);
        return Tap.fromFieldValues(fieldValues);
    }

    async getAll(): Promise<Tap[]> {
        const keys = await this.scanKeys("tap:*");
        const taps = await Promise.all(keys.map(key => this.get(this.fromDbId(key))));
        return taps as Tap[];
    }

    async create(
        name: string,
        order: number,
        volume: number,
        isActive: boolean,
        weight: string,
        brew: string,
    ): Promise<Tap> {
        const id = await this.newId(ID_COUNTER_KEY);

        await this.set(id, {
            id,
            name,
            order: `${order}`,
            volume: `${volume}`,
            isActive: `${isActive}`,
            weight,
            brew
        });

        return new Tap(id, name, order, volume, isActive, weight, brew);
    }

    async update(
        id: string,
        name: string,
        order: number,
        volume: number,
        isActive: boolean,
        weight: string,
        brew: string,
    ): Promise<Tap | undefined> {
        const exists = await this.exists(id);
        if (!exists) {
            return;
        }

        const success = await this.set(id, {
            id,
            name,
            order: `${order}`,
            volume: `${volume}`,
            isActive: `${isActive}`,
            weight,
            brew
        });

        if (success) {
            return new Tap(id, name, order, volume, isActive, weight, brew);
        }
    }

    async remove(id: string): Promise<Tap | undefined> {
        const tap = await this.get(id);

        if (tap) {
            if (await this.del(id) !== 1) {
                throw "Failed to delete tap."
            }
        }

        return tap;
    }

}