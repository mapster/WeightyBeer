import { Field, ObjectType } from "typegql";

@ObjectType()
export class Weight {
    @Field() id: string;
    @Field() zero: number;
    @Field() empty: number;
    @Field() full: number;
    @Field() current: number;
    @Field() percent: number;

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
        if (id && !isNaN(zeroInt) && !isNaN(emptyInt) && !isNaN(fullInt) && !isNaN(currentInt) && !isNaN(percentInt)) {
            return new Weight(id, zeroInt, emptyInt, fullInt, currentInt, percentInt);
        }
    }
}