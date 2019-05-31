import { Field, ObjectType } from "typegql";
import { GraphQLInt } from "graphql";

@ObjectType()
export class Weight {
    @Field({ isNullable: false }) id: string;
    @Field({ isNullable: true, type: GraphQLInt }) zero?: number;
    @Field({ isNullable: true, type: GraphQLInt }) empty?: number;
    @Field({ isNullable: true, type: GraphQLInt }) full?: number;
    @Field({ isNullable: false, type: GraphQLInt }) current: number;
    @Field({ isNullable: false, type: GraphQLInt }) percent: number;

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
        const percentInt = parseInt(percent);
        if (id && !isNaN(currentInt) && !isNaN(percentInt)) {
            return new Weight(id, zeroInt, emptyInt, fullInt, currentInt, percentInt);
        }
    }
}