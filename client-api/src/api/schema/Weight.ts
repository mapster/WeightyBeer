import { Field, ObjectType, Context, registerEnum, Int, Arg } from "typegql";
import { GraphQLString } from "graphql";
import { DaoContext } from "../../DaoContext";

export enum CalibrationTarget {
    zero = 'zero', 
    empty = 'empty', 
    full = 'full'
}
registerEnum(CalibrationTarget, {name: 'CalibrationTarget'});

@ObjectType()
export class Weight {
    @Field({ isNullable: false }) id: string;
    @Field({ isNullable: true, type: Int }) zero?: number;
    @Field({ isNullable: true, type: Int }) empty?: number;
    @Field({ isNullable: true, type: Int }) full?: number;
    @Field({ isNullable: false, type: Int }) current: number;
    @Field({ isNullable: false, type: Int }) percent: number;

    constructor(
        id: string,
        zero: number,
        empty: number,
        full: number,
        current: number,
        percent: number,
    ) {
        this.id = id;
        this.zero = zero;
        this.empty = empty;
        this.full = full;
        this.current = current;
        this.percent = percent;
    }


    static fromFieldValues({ id, zero, empty, full, current, percent }: FieldMap): Weight | undefined {
        const zeroInt = parseInt(zero);
        const emptyInt = parseInt(empty);
        const fullInt = parseInt(full);
        const currentInt = parseInt(current);
        const percentInt = parseInt(percent) || 0;
        if (id && !isNaN(currentInt) && !isNaN(percentInt)) {
            return new Weight(id, zeroInt, emptyInt, fullInt, currentInt, percentInt);
        }
    }
}

@ObjectType()
export class WeightMutation {

    @Field({isNullable: false, type: GraphQLString})
    async calibrate(
        @Context context: DaoContext,
        id: string,
        @Arg({ type: CalibrationTarget }) target: CalibrationTarget
    ) : Promise<string> {
        await context.actionPublisher.sendAction({id, type: 'calibrate', target});
        return id;
    }

    @Field({isNullable: false, type: GraphQLString})
    async customCalibration(
        @Context context: DaoContext,
        id: string,
        @Arg({ type: CalibrationTarget }) target: CalibrationTarget,
        @Arg({ isNullable: false, type: Int }) value: number
    ) : Promise<string> {
        await context.actionPublisher.sendAction({id, type: 'customCalibration', target, value});
        return id;
    }
}