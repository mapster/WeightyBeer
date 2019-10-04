import { ObjectType, Field, Context } from "typegql";
import { RepoContext } from "../../RepoContext";

@ObjectType()
export class Image {
    @Field({ isNullable: false }) id: string;
    @Field({ isNullable: false }) url: string;

    constructor(id: string, url: string) {
        this.id = id;
        this.url = url;
    }

}

@ObjectType()
export class ImageMutation {

    @Field({ isNullable: true, type: Image })
    remove(@Context context: RepoContext, id: string): Promise<Image | undefined> {
        return context.imageRepo.remove(id);
    }

}