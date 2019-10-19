import { ObjectType, Field, Context, Arg, Int } from "typegql";
import { DaoContext } from "../../DaoContext";
import { Brew } from "./Brew";
import { Weight } from "./Weight";

@ObjectType()
export class Tap {
    @Field({ isNullable: false }) id: string;
    @Field({ isNullable: false }) name: string;
    @Field({ isNullable: false, type: Int }) order: number;
    @Field({ isNullable: false }) volume: number;
    @Field({ isNullable: false }) isActive: boolean;
    private _weight: string;
    private _brew: string;

    constructor(
        id: string,
        name: string,
        order: number,
        volume: number,
        isActive: boolean,
        weight: string,
        brew: string,
    ) {
        this.id = id;
        this.name = name;
        this.order = order;
        this.volume = volume;
        this._weight = weight;
        this.isActive = isActive;
        this._brew = brew;
    }

    @Field({ isNullable: true, type: Brew })
    async brew(@Context context: DaoContext): Promise<Brew | undefined> {
        return context.brewRepo.get(this._brew);
    }

    @Field({ isNullable: true, type: Weight })
    async weight(@Context context: DaoContext): Promise<Weight | undefined> {
        return context.weightRepo.get(this._weight);
    }

    static fromFieldValues({ id, name, order, volume, isActive, weight, brew }: FieldMap): Tap | undefined {
        const orderInt = parseInt(order);
        const volumeFloat = parseFloat(volume);
        if (id && name && !isNaN(orderInt) && !isNaN(volumeFloat)) {
            return new Tap(id, name, orderInt, volumeFloat, isActive === 'true', weight, brew);
        }
    }
}

// TODO: Do something about empty strings. Redis will interpret empty string as null and it will fail

@ObjectType()
export class TapMutation {

    @Field({ isNullable: false, type: Tap })
    async create(
        @Context context: DaoContext,
        name: string,
        @Arg({ type: Int }) order: number,
        volume: number,
        isActive: boolean,
        @Arg({ isNullable: true }) weight: string,
        @Arg({ isNullable: true }) brew: string,
    ): Promise<Tap> {
        return await context.tapRepo.create(name, order, volume, isActive, weight, brew);
    }

    @Field({ isNullable: true, type: Tap })
    async update(
        @Context context: DaoContext,
        id: string,
        name: string,
        @Arg({ type: Int }) order: number,
        volume: number,
        isActive: boolean,
        @Arg({ isNullable: true }) weight: string,
        @Arg({ isNullable: true }) brew: string,
    ): Promise<Tap | undefined> {
        return await context.tapRepo.update(id, name, order, volume, isActive, weight, brew);
    }

    @Field({ isNullable: true, type: Tap })
    async remove(@Context context: DaoContext, id: string): Promise<Tap | undefined> {
        return await context.tapRepo.remove(id);
    }
}