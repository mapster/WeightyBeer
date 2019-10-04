import { Image } from "../api/schema/Image";
import { Redis } from "ioredis";
import { RedisRepository } from "./RedisRepository";
import { UploadedFile } from "express-fileupload";
import * as fs from 'fs';

const ID_COUNTER_KEY = 'counter:image';

export class ImageRepository extends RedisRepository {

    constructor(redis: Redis, private imagePath: String) {
        super(redis);
    }

    async create(file: UploadedFile): Promise<string> {
        const id = await this.newId(ID_COUNTER_KEY);
        const filename = `${id}_${file.name}`;        

        await file.mv(this.getFilePath(filename));

        const imageUpload = {id, filename};
        await this.set(id, imageUpload);

        return id;
    }

    async get(id: string): Promise<Image | undefined> {
        const fieldValues = await this.getFieldValues(id);
        return ImageRepository.fromFieldValues(fieldValues);
    }

    async getAll(): Promise<Image[]> {
        const keys = await this.scanKeys("image:*");
        const images = await Promise.all(keys.map(key => this.get(this.fromDbId(key))));
        return images as Image[];
    }

    async remove(id: string): Promise<Image | undefined> {
        const fieldValues = await this.getFieldValues(id);
        const image = ImageRepository.fromFieldValues(fieldValues);

        if (image) {
            fs.unlinkSync(fieldValues.filename);
            if (await this.del(id) !== 1) {
                throw "Failed to delete image."
            }
        }

        return image;
    }

    protected asDbId(id: string): string {
        return `image:${id}`;
    }
    
    private static fromFieldValues(fieldMap: FieldMap): Image | undefined {
        if (fieldMap.id && fieldMap.filename) {
            return new Image(
                fieldMap.id,
                `/images/${fieldMap.filename}`,
            );
        }
    }

    getFilePath(filename: string): string {
        let path = this.imagePath;
        if (!path.endsWith('/')) {
            path = `${path}/`;
        }
        return path + filename;
    }
}