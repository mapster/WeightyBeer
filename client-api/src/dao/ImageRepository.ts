import { Image } from "../api/schema/Image";
import { Redis } from "ioredis";
import { RedisRepository } from "./RedisRepository";

const ID_COUNTER_KEY = 'counter:image';

export class ImageRepository extends RedisRepository {

    constructor(redis: Redis) {
        super(redis);
    }

    async get(id: string): Promise<Image | undefined> {
        const fieldValues = await this.getFieldValues(id);
        return Image.fromFieldValues(fieldValues);
    }

    async remove(id: string): Promise<Image | undefined> {
        const image = await this.get(id);

        if (image) {
            if (await this.del(id) !== 1) {
                throw "Failed to delete image."
            }
        }

        return image;
    }

    protected asDbId(id: string): string {
        return `image:${id}`;
    }
}