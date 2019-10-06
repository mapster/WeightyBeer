module Page.WeightHub exposing (Model, Msg, getError, init, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.Button as Button
import Component.ErrorDetails exposing (ErrorDetails, errorDetails)
import Component.Icon exposing (Icon(..), icon)
import Component.Table exposing (viewTable)
import Graphql.Http
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class)
import Type.Weight exposing (Weight, makeUpdateRequest, requestWeights, updateEmptyRequest, updateFullRequest, updateZeroRequest)
import Type.WeightID as WeightID exposing (WeightID)


type Msg
    = GotWeightsResponse WeightsResponse
    | RequestSetZero WeightID
    | RequestSetEmptyKeg WeightID
    | RequestSetFullKeg WeightID
    | GotUpdateResponse UpdateResponse


type alias Model =
    { navKey : Nav.Key
    , weights : List Weight
    , error : Maybe ErrorDetails
    }


type alias UpdateResponse =
    Result (Graphql.Http.Error ()) WeightID


type alias WeightsResponse =
    Result (Graphql.Http.Error ()) (List Weight)


getError : Model -> Maybe ErrorDetails
getError _ =
    Nothing


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
    ( Model navKey [] Nothing, requestWeights GotWeightsResponse )


view : Model -> Html Msg
view model =
    viewTable
        [ ( "ID", .id >> WeightID.toString >> text )
        , ( "Current", viewCurrent )
        , ( "Nothing", viewNothing )
        , ( "Empty Keg", viewEmpty )
        , ( "Full Keg", viewFull )
        ]
        model.weights


viewFull : Weight -> Html Msg
viewFull { id, full } =
    let
        str =
            Maybe.map String.fromInt full
                |> Maybe.withDefault "_"
                |> text
    in
    div [ class "red-button-text" ]
        [ span [] [ str ]
        , Button.withIcon (RequestSetFullKeg id) Refresh
        ]


viewEmpty : Weight -> Html Msg
viewEmpty { id, empty } =
    let
        str =
            Maybe.map String.fromInt empty
                |> Maybe.withDefault "_"
                |> text
    in
    div [ class "red-button-text" ]
        [ span [] [ str ]
        , Button.withIcon (RequestSetEmptyKeg id) Refresh
        ]


viewNothing : Weight -> Html Msg
viewNothing { id, zero } =
    let
        str =
            Maybe.map String.fromInt zero
                |> Maybe.withDefault "_"
                |> text
    in
    div [ class "red-button-text" ]
        [ span [] [ str ]
        , Button.withIcon (RequestSetZero id) Refresh
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

        RequestSetZero id ->
            ( model, updateZeroRequest id |> makeUpdateRequest GotUpdateResponse )

        RequestSetEmptyKeg id ->
            ( model, updateEmptyRequest id |> makeUpdateRequest GotUpdateResponse )

        RequestSetFullKeg id ->
            ( model, updateFullRequest id |> makeUpdateRequest GotUpdateResponse )

        -- TODO: Add some kind of notification of done
        GotUpdateResponse updateResponse ->
            ( model, Cmd.none )


updateFromWeightsResponse : Model -> WeightsResponse -> Model
updateFromWeightsResponse model response =
    case response of
        Ok weights ->
            { model | weights = weights }

        Err error ->
            { model | error = Just <| errorDetails "Failed to fetch weights" error }
