module Type.Tap exposing (Brew, Tap, Weight, brewSelection, tapSelection, updateTapRequest, weightSelection)

import Constants exposing (weightyBeerHost)
import Graphql.Http
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Type.BrewID as BrewID exposing (BrewID)
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
    { id : TapID
    , name : String
    , order : Int
    , volume : Float
    , brew : Maybe Brew
    , weight : Maybe Weight
    }


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


tapSelection : SelectionSet Tap WeightyBeer.Object.Tap
tapSelection =
    SelectionSet.map6 Tap
        TapID.selection
        WeightyBeer.Object.Tap.name
        WeightyBeer.Object.Tap.order
        WeightyBeer.Object.Tap.volume
        (WeightyBeer.Object.Tap.brew brewSelection)
        (WeightyBeer.Object.Tap.weight weightSelection)


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


updateTapRequest : Tap -> SelectionSet result WeightyBeer.Object.Tap -> (Result (Graphql.Http.Error (Maybe result)) (Maybe result) -> msg) -> Cmd msg
updateTapRequest tap resultSelectionSet msg =
    let
        required =
            { id = TapID.toString tap.id
            , name = tap.name
            , order = tap.order
            , volume = tap.volume
            , isActive = True
            }
    in
    WeightyBeer.Object.TapMutation.update (fillInTapOptionals tap) required resultSelectionSet
        |> Mutation.tap
        |> Graphql.Http.mutationRequest weightyBeerHost
        |> Graphql.Http.send msg


type alias HasId a =
    { a | id : String }


fillInOptional : Maybe a -> (a -> b) -> OptionalArgument b
fillInOptional arg getter =
    Maybe.map (getter >> Present) arg
        |> Maybe.withDefault Absent


fillInTapOptionals : Tap -> UpdateOptionalArguments -> UpdateOptionalArguments
fillInTapOptionals tap optional =
    { brew =
        Maybe.map (.id >> BrewID.toString >> Present) tap.brew
            |> Maybe.withDefault optional.brew
    , weight =
        Maybe.map (.id >> WeightID.toString >> Present) tap.weight
            |> Maybe.withDefault optional.weight
    }
