module Type.Brew exposing (Brew, Image, PartialBrew, brewSelection, createRequest, emptyPartial, imageDecoder, imageSelection, isModified, makeDeleteImageRequest, makeMutationRequest, toNewBrew, toPartial)

import Constants exposing (weightyBeerGraphql, weightyBeerHost)
import Graphql.Http
import Graphql.OptionalArgument exposing (OptionalArgument)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Json.Decode
import Maybe.Extra exposing (andMap)
import Type.BrewID as BrewID exposing (BrewID)
import Type.ImageID as ImageID exposing (ImageID)
import Type.ModifiableValue as Value exposing (Value(..))
import Utils exposing (fillInOptional)
import WeightyBeer.Mutation as Mutation
import WeightyBeer.Object
import WeightyBeer.Object.Brew
import WeightyBeer.Object.BrewMutation
import WeightyBeer.Object.Image
import WeightyBeer.Object.ImageMutation


type alias Brew =
    { id : BrewID
    , brewNumber : Int
    , name : String
    , style : String
    , ibu : Int
    , abv : Float
    , image : Maybe Image
    }


type alias NewBrew =
    { brewNumber : Int
    , name : String
    , style : String
    , ibu : Int
    , abv : Float
    , image : Maybe Image
    }


type alias PartialBrew =
    { id : Maybe BrewID
    , brewNumber : Value Int
    , name : Value String
    , style : Value String
    , ibu : Value Int
    , abv : Value Float
    , image : Value Image
    }


type alias Image =
    { id : ImageID
    , url : String
    }


toPartial : Brew -> PartialBrew
toPartial { id, brewNumber, name, style, ibu, abv, image } =
    PartialBrew
        (Just id)
        (Original brewNumber)
        (Original name)
        (Original style)
        (Original ibu)
        (Original abv)
        (Maybe.Extra.unwrap NoValue Original image)


isModified : PartialBrew -> Bool
isModified { brewNumber, name, style, ibu, abv, image } =
    Value.isModified brewNumber
        || Value.isModified name
        || Value.isModified style
        || Value.isModified ibu
        || Value.isModified abv
        || Value.isModified image


emptyPartial : PartialBrew
emptyPartial =
    PartialBrew Nothing NoValue NoValue NoValue NoValue NoValue NoValue


toNewBrew : PartialBrew -> Maybe NewBrew
toNewBrew { brewNumber, name, style, ibu, abv, image } =
    Maybe.map NewBrew (Value.toMaybe brewNumber)
        |> andMap (Value.toMaybe name)
        |> andMap (Value.toMaybe style)
        |> andMap (Value.toMaybe ibu)
        |> andMap (Value.toMaybe abv)
        |> andMap (Just (Value.toMaybe image))


brewSelection : SelectionSet Brew WeightyBeer.Object.Brew
brewSelection =
    SelectionSet.map7 Brew
        BrewID.selection
        WeightyBeer.Object.Brew.brewNumber
        WeightyBeer.Object.Brew.name
        WeightyBeer.Object.Brew.style
        WeightyBeer.Object.Brew.ibu
        WeightyBeer.Object.Brew.abv
        (WeightyBeer.Object.Brew.image imageSelection)


imageSelection : SelectionSet Image WeightyBeer.Object.Image
imageSelection =
    SelectionSet.map2 Image
        ImageID.selection
        (SelectionSet.map ((++) weightyBeerHost) WeightyBeer.Object.Image.url)


imageDecoder : Json.Decode.Decoder Image
imageDecoder =
    Json.Decode.map2 Image
        ImageID.jsonDecode
        (Json.Decode.map ((++) weightyBeerHost) <| Json.Decode.field "url" Json.Decode.string)


makeDeleteImageRequest : ImageID -> (Result (Graphql.Http.Error ()) (Maybe Image) -> msg) -> Cmd msg
makeDeleteImageRequest id msg =
    WeightyBeer.Object.ImageMutation.remove { id = ImageID.toString id } imageSelection
        |> Mutation.image
        |> Graphql.Http.mutationRequest weightyBeerGraphql
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> msg)


type alias MutationRequest result =
    SelectionSet result WeightyBeer.Object.BrewMutation


createRequest : NewBrew -> SelectionSet result WeightyBeer.Object.Brew -> MutationRequest result
createRequest brew resultSelectionSet =
    let
        required =
            { brewNumber = brew.brewNumber
            , name = brew.name
            , style = brew.style
            , ibu = brew.ibu
            , abv = brew.abv
            }
    in
    WeightyBeer.Object.BrewMutation.create (fillInBrewOptionals brew) required resultSelectionSet


makeMutationRequest : MutationRequest result -> (Result (Graphql.Http.Error ()) result -> msg) -> Cmd msg
makeMutationRequest request msg =
    Mutation.brew request
        |> Graphql.Http.mutationRequest weightyBeerGraphql
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> msg)


type alias MutationOptionalArguments =
    { image : OptionalArgument String }


fillInBrewOptionals : NewBrew -> MutationOptionalArguments -> MutationOptionalArguments
fillInBrewOptionals brew _ =
    { image = fillInOptional brew.image (.id >> ImageID.toString) }
