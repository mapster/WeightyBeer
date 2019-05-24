import { Query, SchemaRoot, compileSchema, Context, Mutation } from "typegql";
import { Brew, BrewMutation } from "./Brew";
import { RepoContext } from "../../RepoContext";
import { Image, ImageMutation } from "./Image";
import { Tap, TapMutation } from "./Tap";
import { Weight } from "./Weight";


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

    @Query({ isNullable: true, type: Tap })
    async tap(@Context context: RepoContext, id: string): Promise<Tap | undefined> {
        return await context.tapRepo.get(id);
    }

    @Query({ type: [Tap] })
    async taps(@Context context: RepoContext): Promise<Tap[] | undefined> {
        return await context.tapRepo.getAll();
    }

    @Query({ isNullable: true, type: Weight })
    async weight(@Context context: RepoContext, id: string): Promise<Weight | undefined> {
        return await context.weightRepo.get(id);
    }

    @Query({ type: [Weight] })
    async weights(@Context context: RepoContext): Promise<Weight[] | undefined> {
        return await context.weightRepo.getAll();
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

    @Mutation()
    tap(): TapMutation {
        return new TapMutation();
    }
}

export const compiledSchema = compileSchema({ roots: [QuerySchema, MutationSchema] });