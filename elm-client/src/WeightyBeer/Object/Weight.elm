-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module WeightyBeer.Object.Weight exposing (current, empty, full, id, percent, zero)

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


id : SelectionSet String WeightyBeer.Object.Weight
id =
    Object.selectionForField "String" "id" [] Decode.string


zero : SelectionSet (Maybe Float) WeightyBeer.Object.Weight
zero =
    Object.selectionForField "(Maybe Float)" "zero" [] (Decode.float |> Decode.nullable)


empty : SelectionSet (Maybe Float) WeightyBeer.Object.Weight
empty =
    Object.selectionForField "(Maybe Float)" "empty" [] (Decode.float |> Decode.nullable)


full : SelectionSet (Maybe Float) WeightyBeer.Object.Weight
full =
    Object.selectionForField "(Maybe Float)" "full" [] (Decode.float |> Decode.nullable)


current : SelectionSet Float WeightyBeer.Object.Weight
current =
    Object.selectionForField "Float" "current" [] Decode.float


percent : SelectionSet Float WeightyBeer.Object.Weight
percent =
    Object.selectionForField "Float" "percent" [] Decode.float
