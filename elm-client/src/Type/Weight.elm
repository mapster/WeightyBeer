module Type.Weight exposing (Weight, makeUpdateRequest, requestWeights, updateEmptyRequest, updateFullRequest, updateZeroRequest, weightSelection)

import Constants exposing (weightyBeerGraphql)
import Graphql.Http
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Type.WeightID as WeightID exposing (WeightID)
import WeightyBeer.Mutation as Mutation
import WeightyBeer.Object
import WeightyBeer.Object.Weight
import WeightyBeer.Object.WeightMutation
import WeightyBeer.Query as Query


type alias Weight =
    { id : WeightID
    , zero : Maybe Int
    , empty : Maybe Int
    , full : Maybe Int
    , current : Int
    , percent : Int
    }


weightSelection : SelectionSet Weight WeightyBeer.Object.Weight
weightSelection =
    SelectionSet.map6 Weight
        WeightID.selection
        WeightyBeer.Object.Weight.zero
        WeightyBeer.Object.Weight.empty
        WeightyBeer.Object.Weight.full
        WeightyBeer.Object.Weight.current
        WeightyBeer.Object.Weight.percent


requestWeights : (Result (Graphql.Http.Error ()) (List Weight) -> msg) -> Cmd msg
requestWeights msg =
    Query.weights weightSelection
        |> Graphql.Http.queryRequest weightyBeerGraphql
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> msg)


type alias MutationRequest =
    SelectionSet WeightID WeightyBeer.Object.WeightMutation


updateZeroRequest : WeightID -> MutationRequest
updateZeroRequest id =
    WeightyBeer.Object.WeightMutation.updateZero { id = WeightID.toString id }
        |> WeightID.stringSelection


updateEmptyRequest : WeightID -> MutationRequest
updateEmptyRequest id =
    WeightyBeer.Object.WeightMutation.updateEmpty { id = WeightID.toString id }
        |> WeightID.stringSelection


updateFullRequest : WeightID -> MutationRequest
updateFullRequest id =
    WeightyBeer.Object.WeightMutation.updateFull { id = WeightID.toString id }
        |> WeightID.stringSelection


makeUpdateRequest : (Result (Graphql.Http.Error ()) WeightID -> msg) -> MutationRequest -> Cmd msg
makeUpdateRequest msg request =
    Mutation.weight request
        |> Graphql.Http.mutationRequest weightyBeerGraphql
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> msg)
