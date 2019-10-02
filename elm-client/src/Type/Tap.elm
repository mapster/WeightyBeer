module Type.Tap exposing (Brew, ExistingTap(..), PartialTap, Weight, brewSelection, createRequest, emptyPartial, isModified, makeMutationRequest, tapSelection, toExistingTap, toPartial, toTap, updateOriginals, updateRequest, weightSelection)

import Constants exposing (weightyBeerHost)
import Graphql.Http
import Graphql.OptionalArgument as OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Maybe
import Maybe.Extra exposing (andMap)
import Type.BrewID as BrewID exposing (BrewID)
import Type.ModifiableValue as Value exposing (Value(..), toMaybe)
import Type.TapID as TapID exposing (TapID)
import Type.WeightID as WeightID exposing (WeightID)
import WeightyBeer.Mutation as Mutation
import WeightyBeer.Object
import WeightyBeer.Object.Brew
import WeightyBeer.Object.Image
import WeightyBeer.Object.Tap
import WeightyBeer.Object.TapMutation exposing (UpdateOptionalArguments, UpdateRequiredArguments)
import WeightyBeer.Object.Weight


type alias Tap =
    { name : String
    , order : Int
    , volume : Float
    , brew : Maybe Brew
    , weight : Maybe Weight
    }


type ExistingTap
    = ExistingTap TapID Tap


type alias PartialTap =
    { id : Maybe TapID
    , name : Value String
    , order : Value Int
    , volume : Value Float
    , brew : Value Brew
    , weight : Value Weight
    }


toPartial : ExistingTap -> PartialTap
toPartial (ExistingTap id { name, order, volume, brew, weight }) =
    PartialTap
        (Just id)
        (Original name)
        (Original order)
        (Original volume)
        (Maybe.Extra.unwrap NoValue Original brew)
        (Maybe.Extra.unwrap NoValue Original weight)


emptyPartial : PartialTap
emptyPartial =
    PartialTap Nothing NoValue NoValue NoValue NoValue NoValue


toTap : PartialTap -> Maybe Tap
toTap { name, order, volume, brew, weight } =
    Maybe.map Tap (toMaybe name)
        |> andMap (toMaybe order)
        |> andMap (toMaybe volume)
        |> andMap (Just (toMaybe brew))
        |> andMap (Just (toMaybe weight))


toExistingTap : PartialTap -> Maybe ExistingTap
toExistingTap partial =
    Maybe.map ExistingTap partial.id
        |> andMap (toTap partial)


updateOriginals : PartialTap -> ExistingTap -> PartialTap
updateOriginals partial (ExistingTap _ tap) =
    PartialTap
        partial.id
        (Value.updateOriginal partial.name <| Just tap.name)
        (Value.updateOriginal partial.order <| Just tap.order)
        (Value.updateOriginal partial.volume <| Just tap.volume)
        (Value.updateOriginal partial.brew tap.brew)
        (Value.updateOriginal partial.weight tap.weight)


isModified : PartialTap -> Bool
isModified partial =
    Value.isModified partial.name
        || Value.isModified partial.order
        || Value.isModified partial.volume
        || Value.isModified partial.brew
        || Value.isModified partial.weight


type alias Weight =
    { id : WeightID
    , percent : Int
    }


type alias Brew =
    { id : BrewID
    , brewNumber : Int
    , name : String
    , style : String
    , ibu : Int
    , abv : Float
    , image : Maybe String
    }


tapSelection : SelectionSet ExistingTap WeightyBeer.Object.Tap
tapSelection =
    SelectionSet.map2 ExistingTap
        TapID.selection
        (SelectionSet.map5 Tap
            WeightyBeer.Object.Tap.name
            WeightyBeer.Object.Tap.order
            WeightyBeer.Object.Tap.volume
            (WeightyBeer.Object.Tap.brew brewSelection)
            (WeightyBeer.Object.Tap.weight weightSelection)
        )


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


imageSelection : SelectionSet String WeightyBeer.Object.Image
imageSelection =
    WeightyBeer.Object.Image.url


weightSelection : SelectionSet Weight WeightyBeer.Object.Weight
weightSelection =
    SelectionSet.map2 Weight
        WeightID.selection
        WeightyBeer.Object.Weight.percent


type alias MutationRequest result =
    SelectionSet result WeightyBeer.Object.TapMutation


createRequest : Tap -> SelectionSet result WeightyBeer.Object.Tap -> MutationRequest result
createRequest tap resultSelectionSet =
    let
        required =
            { name = tap.name
            , order = tap.order
            , volume = tap.volume
            , isActive = True
            }
    in
    WeightyBeer.Object.TapMutation.create (fillInTapOptionals tap) required resultSelectionSet


updateRequest : ExistingTap -> SelectionSet result WeightyBeer.Object.Tap -> MutationRequest (Maybe result)
updateRequest (ExistingTap id tap) resultSelectionSet =
    let
        required =
            { id = TapID.toString id
            , name = tap.name
            , order = tap.order
            , volume = tap.volume
            , isActive = True
            }
    in
    WeightyBeer.Object.TapMutation.update (fillInTapOptionals tap) required resultSelectionSet


makeMutationRequest : MutationRequest result -> (Result (Graphql.Http.Error ()) result -> msg) -> Cmd msg
makeMutationRequest request msg =
    Mutation.tap request
        |> Graphql.Http.mutationRequest weightyBeerHost
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> msg)


fillInOptional : Maybe a -> (a -> b) -> OptionalArgument b
fillInOptional arg getter =
    (OptionalArgument.fromMaybe >> OptionalArgument.map getter) arg


type alias MutationOptionalArguments =
    { brew : OptionalArgument String, weight : OptionalArgument String }


fillInTapOptionals : Tap -> MutationOptionalArguments -> MutationOptionalArguments
fillInTapOptionals tap _ =
    { brew = fillInOptional tap.brew (.id >> BrewID.toString)
    , weight = fillInOptional tap.weight (.id >> WeightID.toString)
    }
