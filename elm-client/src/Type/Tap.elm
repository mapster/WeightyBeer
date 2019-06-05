module Type.Tap exposing (Brew, Tap, Weight, brewSelection, tapSelection, weightSelection)

import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Type.BrewID as BrewID exposing (BrewID)
import Type.TapID as TapID exposing (TapID)
import Type.WeightID as WeightID exposing (WeightID)
import WeightyBeer.Object
import WeightyBeer.Object.Brew
import WeightyBeer.Object.Image
import WeightyBeer.Object.Tap
import WeightyBeer.Object.Weight
import WeightyBeer.Query as Query


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


tapMutation : SelectionSet (Maybe Tap) RootMutation
tapMutation =
    WeightyBeer.Mutation.tap
