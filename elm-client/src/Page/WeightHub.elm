module Page.WeightHub exposing (Model, Msg, getError, init, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.Button as Button
import Component.ErrorDetails exposing (ErrorDetails, errorDetails)
import Component.Icon exposing (Icon(..))
import Component.Modal as Modal
import Component.Table exposing (viewTable)
import Graphql.Http
import Html exposing (Html, div, h2, i, p, span, text)
import Html.Attributes exposing (class)
import Subscription
import Type.Weight exposing (Weight, calibrateRequest, makeCalibrateRequest, requestWeights, weightSelection, weightUpdatedSubscription)
import Type.WeightID as WeightID exposing (WeightID)
import Utils
import WeightyBeer.Enum.CalibrationTarget exposing (CalibrationTarget(..))


type Msg
    = GotWeightsResponse WeightsResponse
    | GotUpdateResponse UpdateResponse
    | ConfirmRequest CalibrationTarget WeightID
    | CancelRequest
    | CalibrateRequest CalibrationTarget WeightID
    | GotSubscriptionData (Result ErrorDetails Weight)


type alias Model =
    { navKey : Nav.Key
    , weights : List Weight
    , error : Maybe ErrorDetails
    , confirm : Maybe ( CalibrationTarget, WeightID )
    }


type alias UpdateResponse =
    Result (Graphql.Http.Error ()) WeightID


type alias WeightsResponse =
    Result (Graphql.Http.Error ()) (List Weight)


getError : Model -> Maybe ErrorDetails
getError =
    .error


subscriptions : Model -> Sub Msg
subscriptions _ =
    Subscription.receive (weightUpdatedSubscription weightSelection) GotSubscriptionData


emptyModel : Nav.Key -> Model
emptyModel navKey =
    Model navKey [] Nothing Nothing


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
    ( emptyModel navKey, Cmd.batch [ requestWeights GotWeightsResponse, Subscription.create Subscription.WeightHub (weightUpdatedSubscription weightSelection) ] )


view : Model -> Html Msg
view model =
    let
        confirmModal =
            case model.confirm of
                Just confirm ->
                    [ viewConfirm confirm ]

                Nothing ->
                    []
    in
    div []
        ([ viewTable
            [ ( "ID", .id >> WeightID.toString >> text )
            , ( "Current", viewCurrent )
            , ( "Nothing", viewTarget Zero )
            , ( "Empty Keg", viewTarget Empty )
            , ( "Full Keg", viewTarget Full )
            ]
            model.weights
         ]
            ++ confirmModal
        )


viewConfirm : ( CalibrationTarget, WeightID ) -> Html Msg
viewConfirm ( target, id ) =
    let
        targetName =
            case target of
                Zero ->
                    "Nothing"

                Empty ->
                    "Empty Keg"

                Full ->
                    "Full Keg"
    in
    Modal.view CancelRequest <|
        div [ class "confirm-modal" ]
            [ h2 [] [ text "Confirm calibration" ]
            , p [] [ text <| "Are you sure you wish to (irreversibly) calibrate the '" ++ targetName ++ "' setting of weight '" ++ WeightID.toString id ++ "'?" ]
            , i [] [ text "(Note that calibration uses longer smoothening than the current value and will not be equal)" ]
            , Button.view (CalibrateRequest target id) "OK"
            ]


viewRequestButton : CalibrationTarget -> WeightID -> Html Msg
viewRequestButton msg id =
    Button.withIcon (ConfirmRequest msg id) Refresh


targetValue : Weight -> CalibrationTarget -> Maybe Int
targetValue weight target =
    case target of
        Zero ->
            weight.zero

        Empty ->
            weight.empty

        Full ->
            weight.full


viewTarget : CalibrationTarget -> Weight -> Html Msg
viewTarget target weight =
    div [ class "red-button-text" ]
        [ span []
            [ Maybe.map String.fromInt (targetValue weight target)
                |> Maybe.withDefault "_"
                |> text
            ]
        , viewRequestButton target weight.id
        ]


viewCurrent : Weight -> Html Msg
viewCurrent { current, percent } =
    String.fromInt percent
        ++ "% ("
        ++ String.fromInt current
        ++ ")"
        |> text


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotWeightsResponse weightsResponse ->
            ( updateFromWeightsResponse model weightsResponse, Cmd.none )

        ConfirmRequest target id ->
            ( { model | confirm = Just ( target, id ) }, Cmd.none )

        CancelRequest ->
            ( { model | confirm = Nothing }, Cmd.none )

        -- TODO: Add some kind of notification of done
        GotUpdateResponse updateResponse ->
            ( model, requestWeights GotWeightsResponse )

        CalibrateRequest target id ->
            ( model, calibrateRequest id target |> makeCalibrateRequest GotUpdateResponse )

        GotSubscriptionData result ->
            case result of
                Ok weight ->
                    ( { model | weights = Utils.updateInList weight model.weights }, Cmd.none )

                Err e ->
                    ( { model | error = Just e }, Cmd.none )


updateFromWeightsResponse : Model -> WeightsResponse -> Model
updateFromWeightsResponse model response =
    case response of
        Ok weights ->
            { model | weights = weights }

        Err error ->
            { model | error = Just <| errorDetails "Failed to fetch weights" error }
