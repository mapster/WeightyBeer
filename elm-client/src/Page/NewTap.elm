module Page.NewTap exposing (Model, Msg(..), getError, init, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.EditTap exposing (Field)
import Component.ErrorDetails exposing (ErrorDetails, errorDetails)
import Constants exposing (weightyBeerHost)
import Graphql.Http
import Graphql.SelectionSet as SelectionSet
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Route
import Type.Tap exposing (Brew, PartialTap, Weight, brewSelection, emptyPartial, toExistingTap, weightSelection)
import WeightyBeer.Query as Query


type alias Model =
    { navKey : Nav.Key
    , mutation : PartialTap
    , brews : List Brew
    , weights : List Weight
    , error : Maybe ErrorDetails
    }


type Msg
    = GotResponse Response
    | Edit Field String
    | Save
    | Cancel
    | Something


type alias Response =
    Result (Graphql.Http.Error ()) ResponseData


type alias ResponseData =
    { brews : List Brew
    , weights : List Weight
    }


requestBrewsWeights : Cmd Msg
requestBrewsWeights =
    SelectionSet.map2 ResponseData
        (Query.brews brewSelection)
        (Query.weights weightSelection)
        |> Graphql.Http.queryRequest weightyBeerHost
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> GotResponse)


makeSaveRequest : Model -> ( Model, Cmd Msg )
makeSaveRequest model =
    case toExistingTap model.mutation of
        Just tap ->
            --            createTapRequest
            ( model, Cmd.none )

        Nothing ->
            ( { model | error = Just (ErrorDetails "Cannot save: incomplete tap" Nothing) }, Cmd.none )


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
    ( Model navKey emptyPartial [] [] Nothing, requestBrewsWeights )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


getError : Model -> Maybe ErrorDetails
getError =
    .error


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotResponse response ->
            ( updateFromResponse model response, Cmd.none )

        Edit field value ->
            ( { model | mutation = Component.EditTap.update model.brews model.weights model.mutation field value }, Cmd.none )

        Cancel ->
            ( model, Route.replaceUrl model.navKey Route.Taps )

        Something ->
            ( model, Cmd.none )

        Save ->
            makeSaveRequest model


updateFromResponse : Model -> Response -> Model
updateFromResponse model response =
    case response of
        Err error ->
            { model | error = Just (errorDetails "Failed to fetch data from WeightyBeer API" error) }

        Ok data ->
            { model | brews = data.brews, weights = data.weights }


view : Model -> Html Msg
view model =
    div [ class "edit-tap-page-container" ]
        [ Html.map mapEditTapMsg <| Component.EditTap.view model.brews model.weights model.mutation
        ]


mapEditTapMsg : Component.EditTap.Msg -> Msg
mapEditTapMsg msg =
    case msg of
        Component.EditTap.Edit field value ->
            Edit field value

        Component.EditTap.Save ->
            Save

        Component.EditTap.Cancel ->
            Cancel
