import { Query, SchemaRoot, compileSchema, Context, Mutation, registerEnum } from "typegql";
import { Brew, BrewMutation } from "./Brew";
import { DaoContext } from "../../DaoContext";
import { Image, ImageMutation } from "./Image";
import { Tap, TapMutation } from "./Tap";
import { Weight, WeightMutation } from "./Weight";
import { addSubscriptions } from "./Subscriptions";
import { PubSub } from "graphql-subscriptions";
import { GraphQLSchema } from "graphql";

@SchemaRoot()
export class QuerySchema {

    @Query({ isNullable: true, type: Brew })
    async brew(@Context context: DaoContext, id: string): Promise<Brew | undefined> {
        return context.brewRepo.get(id);
    }

    @Query({ isNullable: false, type: [Brew] })
    async brews(@Context context: DaoContext): Promise<Brew[]> {
        return context.brewRepo.getAll();
    }

    @Query({ isNullable: true, type: Image })
    async image(@Context context: DaoContext, id: string): Promise<Image | undefined> {
        return context.imageRepo.get(id)
    }

    @Query({ isNullable: false, type: [Image]})
    async images(@Context context: DaoContext): Promise<Image[]> {
        return context.imageRepo.getAll();
    }

    @Query({ isNullable: true, type: Tap })
    async tap(@Context context: DaoContext, id: string): Promise<Tap | undefined> {
        return await context.tapRepo.get(id);
    }

    @Query({ isNullable: false, type: [Tap] })
    async taps(@Context context: DaoContext): Promise<Tap[] | undefined> {
        return await context.tapRepo.getAll();
    }

    @Query({ isNullable: true, type: Weight })
    async weight(@Context context: DaoContext, id: string): Promise<Weight | undefined> {
        return await context.weightRepo.get(id);
    }

    @Query({ isNullable: false, type: [Weight] })
    async weights(@Context context: DaoContext): Promise<Weight[] | undefined> {
        return await context.weightRepo.getAll();
    }
}

@SchemaRoot()
export class MutationSchema {

    @Mutation({ isNullable: false })
    image(): ImageMutation {
        return new ImageMutation();
    }

    @Mutation({ isNullable: false })
    brew(): BrewMutation {
        return new BrewMutation();
    }

    @Mutation({ isNullable: false })
    tap(): TapMutation {
        return new TapMutation();
    }

    @Mutation({isNullable: false})
    weight(): WeightMutation {
        return new WeightMutation();
    }
}

export function createSchema(pubsub: PubSub): GraphQLSchema {
    return addSubscriptions(pubsub, compileSchema({ roots: [QuerySchema, MutationSchema] }));
};