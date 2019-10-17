module Page.Home exposing (Model, Msg, init, subscriptions, update, view)

import Component.ErrorDetails exposing (ErrorDetails)
import Component.TapCard as TapCard
import Constants exposing (weightyBeerGraphql)
import Dict exposing (Dict)
import Graphql.Http
import Html exposing (..)
import Html.Attributes exposing (..)
import Maybe.Extra
import RemoteData exposing (RemoteData)
import Subscription
import Type.Tap exposing (ExistingTap(..), Weight, tapSelection, toPartial, weightSelection)
import Type.Weight exposing (weightUpdatedSubscription)
import Type.WeightID as WeightID exposing (WeightID)
import WeightyBeer.Query as Query


type Msg
    = GotTapsResponse (RemoteData (Graphql.Http.Error Taps) Taps)
    | GotWeightsResponse (Result ErrorDetails (Maybe Weight))


type alias Model =
    { receivedTaps : RemoteData (Graphql.Http.Error Taps) Taps
    , weights : Dict String Weight
    }


type alias Taps =
    List ExistingTap


type alias Weights =
    List Weight


subscriptions : Model -> Sub Msg
subscriptions _ =
    Subscription.receive Subscription.Home (weightUpdatedSubscription weightSelection) GotWeightsResponse


init : ( Model, Cmd Msg )
init =
    let
        model =
            Model RemoteData.Loading Dict.empty
    in
    ( model, Cmd.batch [ requestTaps, Subscription.create Subscription.Home (weightUpdatedSubscription weightSelection) ] )



--
-- GraphQL
--
--


requestTaps : Cmd Msg
requestTaps =
    Query.taps tapSelection
        |> Graphql.Http.queryRequest weightyBeerGraphql
        |> Graphql.Http.send (RemoteData.fromResult >> GotTapsResponse)



--
-- Update
--
--


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotTapsResponse response ->
            ( { model | receivedTaps = response }, Cmd.none )

        GotWeightsResponse response ->
            ( { model | weights = updateWeights model.weights response }, Cmd.none )


updateWeights : Dict String Weight -> Result ErrorDetails (Maybe Weight) -> Dict String Weight
updateWeights weights result =
    case result of
        Ok (Just weight) ->
            Dict.insert (WeightID.toString weight.id) weight weights

        Ok Nothing ->
            weights

        Err error ->
            weights



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


tapWithWeight : Dict String Weight -> ExistingTap -> ExistingTap
tapWithWeight weights (ExistingTap tapId tap) =
    let
        subscribedWeight =
            Maybe.map .id tap.weight
                |> Maybe.map WeightID.toString
                |> Maybe.andThen (\id -> Dict.get id weights)
    in
    ExistingTap tapId { tap | weight = Maybe.Extra.or subscribedWeight tap.weight }


viewTaps : Dict String Weight -> Taps -> Html Msg
viewTaps weights taps =
    div [ class "home-page-container" ] <| List.map (tapWithWeight weights >> toPartial >> TapCard.view) taps
