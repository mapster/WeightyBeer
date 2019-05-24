import { ObjectType, Field, Context } from "typegql";
import { RepoContext } from "../../RepoContext";
import { Brew } from "./Brew";

@ObjectType()
export class Tap {
    @Field() id: string;
    @Field() name: string;
    @Field() order: number;
    @Field() volume: number;
    @Field() isActive: boolean;
    @Field({ isNullable: true }) weight: string;
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
        this.weight = weight;
        this.isActive = isActive;
        this._brew = brew;
    }

    @Field({ isNullable: true, type: Brew })
    async brew(@Context context: RepoContext): Promise<Brew | undefined> {
        return context.brewRepo.get(this._brew);
    }

    static fromFieldValues({ id, name, order, volume, isActive, weight, brew }: FieldMap): Tap | undefined {
        const orderInt = parseInt(order);
        const volumeFloat = parseFloat(volume);
        if (id && name && !isNaN(orderInt) && !isNaN(volumeFloat)) {
            return new Tap(id, name, orderInt, volumeFloat, isActive === 'true', weight, brew);
        }
    }
}

@ObjectType()
export class TapMutation {

    @Field({ isNullable: true, type: Tap })
    async create(
        @Context context: RepoContext,
        name: string,
        order: number,
        volume: number,
        isActive: boolean,
        weight: string,
        brew: string,
    ): Promise<Tap | undefined> {
        return await context.tapRepo.create(name, order, volume, isActive, weight, brew);
    }

    @Field({ isNullable: true, type: Tap })
    async update(
        @Context context: RepoContext,
        id: string,
        name: string,
        order: number,
        volume: number,
        isActive: boolean,
        weight: string,
        brew: string,
    ): Promise<Tap | undefined> {
        return await context.tapRepo.update(id, name, order, volume, isActive, weight, brew);
    }

    @Field({ isNullable: true, type: Tap })
    async remove(@Context context: RepoContext, id: string): Promise<Tap | undefined> {
        return await context.tapRepo.remove(id);
    }
}