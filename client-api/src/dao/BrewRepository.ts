import { Brew } from "../api/schema/Brew";
import { Redis } from "ioredis";
import { RedisRepository } from "./RedisRepository";

const ID_COUNTER_KEY = 'counter:brew';

export class BrewRepository extends RedisRepository {

    constructor(redis: Redis) {
        super(redis);
    }

    protected asDbId(id: string): string {
        return `brew:${id}`;
    }

    async get(id: string): Promise<Brew | undefined> {
        const fieldValues = await this.getFieldValues(id);
        return Brew.fromFieldValues(fieldValues);
    }

    async getAll(): Promise<Brew[]> {
        const keys = await this.scanKeys("brew:*");
        const brews = await Promise.all(keys.map(key => this.get(this.fromDbId(key))));
        return brews as Brew[];
    }

    async create(
        brewNumber: number,
        name: string,
        style: string,
        ibu: number,
        abv: number,
        image: string,
    ): Promise<Brew> {
        const id = await this.newId(ID_COUNTER_KEY);

        await this.set(id, {
            id,
            brewNumber: `${brewNumber}`,
            name,
            style,
            ibu: `${ibu}`,
            abv: `${abv}`,
            image,
        });

        return new Brew(id, brewNumber, name, style, ibu, abv, image);
    }

    async update(
        id: string,
        brewNumber: number,
        name: string,
        style: string,
        ibu: number,
        abv: number,
        image: string,
    ): Promise<Brew | undefined> {
        const exists = await this.exists(id);
        if (!exists) {
            return;
        }

        const success = await this.set(id, {
            id,
            brewNumber: `${brewNumber}`,
            name,
            style,
            ibu: `${ibu}`,
            abv: `${abv}`,
            image,
        });

        if (success) {
            return new Brew(id, brewNumber, name, style, ibu, abv, image);
        }
    }

    async remove(id: string): Promise<Brew | undefined> {
        const brew = await this.get(id);

        if (brew) {
            if (await this.del(id) !== 1) {
                throw "Failed to delete brew."
            }
        }

        return brew;
    }
}
