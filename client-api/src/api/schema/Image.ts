import { ObjectType, Field, Context } from "typegql";
import Redis from 'ioredis';
import { RepoContext } from "../../RepoContext";
import { ImageRepository } from "../../dao/ImageRepository";

@ObjectType()
export class Image {
    @Field({ isNullable: false }) id: string;
    @Field({ isNullable: false }) url: string;

    constructor(id: string, url: string) {
        this.id = id;
        this.url = url;
    }

    static fromFieldValues(fieldMap: FieldMap): Image | undefined {
        if (fieldMap.id && fieldMap.url) {
            return new Image(
                fieldMap.id,
                fieldMap.url,
            );
        }
    }
}

@ObjectType()
export class ImageMutation {

    // @Field({ type: Image })
    // async create(@Context context: RepoContext, url: string): Promise<Image> {
    //     return await new ImageRepository(new Redis()).create(url);
    // }

    // @Field()
    // update(id: string, url: string): Image {
    //     return this.context.imageRepo.update(id, url);
    // }

    @Field({ isNullable: true, type: Image })
    remove(@Context context: RepoContext, id: string): Promise<Image | undefined> {
        return context.imageRepo.remove(id);
    }
}