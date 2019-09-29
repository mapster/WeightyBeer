module Page.Home exposing (view, init, update, Model, Msg, subscriptions)

import Component.TapCard as TapCard
import Dict exposing (Dict)
import Graphql.Http
import Html exposing (..)
import Html.Attributes exposing (..)
import RemoteData exposing (RemoteData)
import Time
import Type.Tap exposing (Brew, Tap, Weight, tapSelection, toPartial, weightSelection)
import Type.WeightID as WeightID exposing (WeightID)
import WeightyBeer.Query as Query

type Msg
    = GotTapsResponse (RemoteData (Graphql.Http.Error Taps) Taps)
    | GotWeightsResponse (RemoteData (Graphql.Http.Error Weights) Weights)
    | FetchWeights

type alias Model =
    { receivedTaps: RemoteData (Graphql.Http.Error Taps) Taps
    , weights: Dict String Weight
    }

type alias Taps = List Tap
type alias Weights = List Weight

subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 1000 (\_ -> FetchWeights)

init : (Model, Cmd Msg)
init =
    let
        model = Model RemoteData.Loading Dict.empty
    in
        (model, requestTaps)

--
-- GraphQL
--
--
requestTaps : Cmd Msg
requestTaps =
    Query.taps tapSelection
        |> Graphql.Http.queryRequest "http://localhost:3000/graphql"
        |> Graphql.Http.send ( RemoteData.fromResult >> GotTapsResponse )

requestWeights : Cmd Msg
requestWeights =
    Query.weights weightSelection
        |> Graphql.Http.queryRequest "http://localhost:3000/graphql"
        |> Graphql.Http.send ( RemoteData.fromResult >> GotWeightsResponse )



--
-- Update
--
--

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GotTapsResponse response ->
            ({ model | receivedTaps = response}, Cmd.none)

        GotWeightsResponse response ->
            ({ model | weights = updateWeights response }, Cmd.none)

        FetchWeights ->
            (model, requestWeights)

updateWeights : (RemoteData (Graphql.Http.Error Weights) Weights) -> Dict String Weight
updateWeights response =
    case response of
        RemoteData.Success weights ->
            List.map (\w -> (WeightID.toString w.id, w)) weights
                |> Dict.fromList

        _ ->
            Dict.empty

--
-- View
--
--

view : Model -> Html Msg
view model =
    case model.receivedTaps of
        RemoteData.Loading ->
            text "Loading..."

        RemoteData.NotAsked ->
            text "Not asked!"


        RemoteData.Failure e ->
            text "Failed to fetch taps: "


        RemoteData.Success taps ->
                viewTaps model.weights taps

tapWithWeight : Dict String Weight -> Tap -> Tap
tapWithWeight weights tap =
    let
        weight =
            Maybe.map .id tap.weight
                |> Maybe.map WeightID.toString
                |> Maybe.map (\id -> Dict.get id weights)
                |> Maybe.withDefault tap.weight
    in
    { tap | weight = weight }


viewTaps : Dict String Weight -> Taps -> Html Msg
viewTaps weights taps =
    div [ class "home-page-container" ] <| List.map ((tapWithWeight weights) >> toPartial >> TapCard.view) taps

