-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module WeightyBeer.Object.BrewMutation exposing (CreateRequiredArguments, RemoveRequiredArguments, UpdateRequiredArguments, create, remove, update)

import Graphql.Internal.Builder.Argument as Argument exposing (Argument)
import Graphql.Internal.Builder.Object as Object
import Graphql.Internal.Encode as Encode exposing (Value)
import Graphql.Operation exposing (RootMutation, RootQuery, RootSubscription)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet exposing (SelectionSet)
import Json.Decode as Decode
import WeightyBeer.InputObject
import WeightyBeer.Interface
import WeightyBeer.Object
import WeightyBeer.Scalar
import WeightyBeer.ScalarCodecs
import WeightyBeer.Union


type alias CreateRequiredArguments =
    { brewNumber : Float
    , name : String
    , style : String
    , ibu : Float
    , abv : Float
    , image : String
    }


create : CreateRequiredArguments -> SelectionSet decodesTo WeightyBeer.Object.Brew -> SelectionSet (Maybe decodesTo) WeightyBeer.Object.BrewMutation
create requiredArgs object_ =
    Object.selectionForCompositeField "create" [ Argument.required "brewNumber" requiredArgs.brewNumber Encode.float, Argument.required "name" requiredArgs.name Encode.string, Argument.required "style" requiredArgs.style Encode.string, Argument.required "ibu" requiredArgs.ibu Encode.float, Argument.required "abv" requiredArgs.abv Encode.float, Argument.required "image" requiredArgs.image Encode.string ] object_ (identity >> Decode.nullable)


type alias UpdateRequiredArguments =
    { id : String
    , brewNumber : Float
    , name : String
    , style : String
    , ibu : Float
    , abv : Float
    , image : String
    }


update : UpdateRequiredArguments -> SelectionSet decodesTo WeightyBeer.Object.Brew -> SelectionSet (Maybe decodesTo) WeightyBeer.Object.BrewMutation
update requiredArgs object_ =
    Object.selectionForCompositeField "update" [ Argument.required "id" requiredArgs.id Encode.string, Argument.required "brewNumber" requiredArgs.brewNumber Encode.float, Argument.required "name" requiredArgs.name Encode.string, Argument.required "style" requiredArgs.style Encode.string, Argument.required "ibu" requiredArgs.ibu Encode.float, Argument.required "abv" requiredArgs.abv Encode.float, Argument.required "image" requiredArgs.image Encode.string ] object_ (identity >> Decode.nullable)


type alias RemoveRequiredArguments =
    { id : String }


remove : RemoveRequiredArguments -> SelectionSet decodesTo WeightyBeer.Object.Brew -> SelectionSet (Maybe decodesTo) WeightyBeer.Object.BrewMutation
remove requiredArgs object_ =
    Object.selectionForCompositeField "remove" [ Argument.required "id" requiredArgs.id Encode.string ] object_ (identity >> Decode.nullable)
