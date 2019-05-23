import { Query, SchemaRoot, compileSchema, Context, Mutation } from "typegql";
import { Brew, BrewMutation } from "./Brew";
import { RepoContext } from "../../RepoContext";
import { Image, ImageMutation } from "./Image";


@SchemaRoot()
export class QuerySchema {

    @Query({ isNullable: true, type: Brew })
    async brew(@Context context: RepoContext, id: string): Promise<Brew | undefined> {
        return context.brewRepo.get(id);
    }

    @Query({ type: [Brew] })
    async brews(@Context context: RepoContext): Promise<Brew[]> {
        return context.brewRepo.getAll();
    }

    @Query({ isNullable: true, type: Image })
    async image(@Context context: RepoContext, id: string): Promise<Image | undefined> {
        return context.imageRepo.get(id)
    }
}

@SchemaRoot()
export class MutationSchema {

    @Mutation()
    image(): ImageMutation {
        return new ImageMutation();
    }

    @Mutation()
    brew(): BrewMutation {
        return new BrewMutation();
    }

}

export const compiledSchema = compileSchema({ roots: [QuerySchema, MutationSchema] });