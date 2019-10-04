module Type.Brew exposing (Brew, PartialBrew, brewSelection, emptyPartial)

import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Type.BrewID as BrewID exposing (BrewID)
import Type.ImageID as ImageID exposing (ImageID)
import Type.ModifiableValue exposing (Value(..))
import WeightyBeer.Object
import WeightyBeer.Object.Brew
import WeightyBeer.Object.Image


type alias Brew =
    { id : BrewID
    , brewNumber : Int
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


emptyPartial : PartialBrew
emptyPartial =
    PartialBrew Nothing NoValue NoValue NoValue NoValue NoValue NoValue


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
        WeightyBeer.Object.Image.url
