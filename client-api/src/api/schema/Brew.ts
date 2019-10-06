import { ObjectType, Field, ID, Context, Arg } from 'typegql';
import { Image } from './Image';
import { DaoContext } from '../../DaoContext';
import { BrewRepository } from '../../dao/BrewRepository';
import { GraphQLInt } from 'graphql';

@ObjectType()
export class Brew {
    @Field({ isNullable: false }) id: string;
    @Field({ isNullable: false, type: GraphQLInt }) brewNumber: number;
    @Field({ isNullable: false }) name: string;
    @Field({ isNullable: false }) style: string;
    @Field({ isNullable: false, type: GraphQLInt }) ibu: number;
    @Field({ isNullable: false }) abv: number;
    private _image: string;

    constructor(id: string, brewNumber: number, name: string, style: string, ibu: number, abv: number, image: string) {
        this.id = id;
        this.brewNumber = brewNumber;
        this.name = name;
        this.style = style;
        this.ibu = ibu;
        this.abv = abv;
        this._image = image;
    }

    @Field({ type: Image })
    async image(@Context context: DaoContext): Promise<Image | undefined> {
        if (this._image) {
            return context.imageRepo.get(this._image);
        }
    }

    static fromFieldValues({ id, brewNumber, name, style, ibu, abv, image }: FieldMap): Brew | undefined {
        const brewNumberInt = parseInt(brewNumber);
        const ibuInt = parseInt(ibu);
        const abvFloat = parseFloat(abv);
        if (id && !isNaN(brewNumberInt) && name && style && !isNaN(ibuInt) && !isNaN(abvFloat)) {
            return new Brew(id, brewNumberInt, name, style, ibuInt, abvFloat, image);
        }
    }
}

@ObjectType()
export class BrewMutation {

    @Field({ isNullable: false, type: Brew })
    async create(
        @Context context: DaoContext,
        @Arg({ type: GraphQLInt }) brewNumber: number,
        name: string,
        style: string,
        @Arg({ type: GraphQLInt }) ibu: number,
        abv: number,
        @Arg({ isNullable: true }) image: string,
    ): Promise<Brew> {
        return await context.brewRepo.create(brewNumber, name, style, ibu, abv, image);
    }

    @Field({ isNullable: true, type: Brew })
    async update(
        @Context context: DaoContext,
        id: string,
        @Arg({ type: GraphQLInt }) brewNumber: number,
        name: string,
        style: string,
        @Arg({ type: GraphQLInt }) ibu: number,
        abv: number,
        @Arg({ isNullable: true }) image: string,
    ): Promise<Brew | undefined> {
        return context.brewRepo.update(id, brewNumber, name, style, ibu, abv, image);
    }

    @Field({ isNullable: true, type: Brew })
    async remove(@Context context: DaoContext, id: string): Promise<Brew | undefined> {
        return context.brewRepo.remove(id);
    }
}
