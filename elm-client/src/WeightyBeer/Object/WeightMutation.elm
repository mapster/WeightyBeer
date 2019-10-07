-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module WeightyBeer.Object.WeightMutation exposing (UpdateEmptyRequiredArguments, UpdateFullRequiredArguments, UpdateZeroRequiredArguments, updateEmpty, updateFull, updateZero)

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


type alias UpdateZeroRequiredArguments =
    { id : String }


updateZero : UpdateZeroRequiredArguments -> SelectionSet String WeightyBeer.Object.WeightMutation
updateZero requiredArgs =
    Object.selectionForField "String" "updateZero" [ Argument.required "id" requiredArgs.id Encode.string ] Decode.string


type alias UpdateEmptyRequiredArguments =
    { id : String }


updateEmpty : UpdateEmptyRequiredArguments -> SelectionSet String WeightyBeer.Object.WeightMutation
updateEmpty requiredArgs =
    Object.selectionForField "String" "updateEmpty" [ Argument.required "id" requiredArgs.id Encode.string ] Decode.string


type alias UpdateFullRequiredArguments =
    { id : String }


updateFull : UpdateFullRequiredArguments -> SelectionSet String WeightyBeer.Object.WeightMutation
updateFull requiredArgs =
    Object.selectionForField "String" "updateFull" [ Argument.required "id" requiredArgs.id Encode.string ] Decode.string