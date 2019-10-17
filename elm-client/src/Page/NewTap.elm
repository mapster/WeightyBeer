module Page.NewTap exposing (Model, Msg(..), getError, init, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.EditTap exposing (Field)
import Component.ErrorDetails exposing (ErrorDetails, errorDetails)
import Constants exposing (weightyBeerGraphql)
import Graphql.Http
import Graphql.SelectionSet as SelectionSet
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Route
import Type.Brew exposing (Brew, brewSelection)
import Type.Page exposing (Page)
import Type.Tap as Tap exposing (ExistingTap, PartialTap, Weight, emptyPartial, toExistingTap, toPartial, toTap, weightSelection)
import WeightyBeer.Query as Query


page : Page Model Msg ()
page =
    Page init view update subscriptions getError


type alias Model =
    { navKey : Nav.Key
    , mutation : PartialTap
    , brews : List Brew
    , weights : List Weight
    , error : Maybe ErrorDetails
    }


type Msg
    = GotResponse Response
    | GotSaveResponse SaveResponse
    | Edit Field String
    | Save
    | Cancel


type alias Response =
    Result (Graphql.Http.Error ()) BrewsWeightsData


type alias BrewsWeightsData =
    { brews : List Brew
    , weights : List Weight
    }


type alias SaveResponse =
    Result (Graphql.Http.Error ()) ExistingTap


requestBrewsWeights : Cmd Msg
requestBrewsWeights =
    SelectionSet.map2 BrewsWeightsData
        (Query.brews brewSelection)
        (Query.weights weightSelection)
        |> Graphql.Http.queryRequest weightyBeerGraphql
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> GotResponse)


makeSaveRequest : Model -> ( Model, Cmd Msg )
makeSaveRequest model =
    case toTap model.mutation of
        Just tap ->
            ( model, Tap.makeMutationRequest (Tap.createRequest tap Tap.tapSelection) GotSaveResponse )

        Nothing ->
            ( { model | error = Just (ErrorDetails "Cannot save: incomplete tap" Nothing) }, Cmd.none )


init : Nav.Key -> () -> ( Model, Cmd Msg )
init navKey _ =
    ( Model navKey emptyPartial [] [] Nothing, requestBrewsWeights )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


getError : Model -> Maybe ErrorDetails
getError =
    .error


navigateToTaps : Nav.Key -> Cmd Msg
navigateToTaps =
    Route.replaceUrl Route.Taps


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotSaveResponse response ->
            updateFromSaveResponse model response

        GotResponse response ->
            ( updateFromResponse model response, Cmd.none )

        Edit field value ->
            ( { model | mutation = Component.EditTap.update model.brews model.weights model.mutation field value }, Cmd.none )

        Cancel ->
            ( model, navigateToTaps model.navKey )

        Save ->
            makeSaveRequest model


updateFromSaveResponse : Model -> SaveResponse -> ( Model, Cmd Msg )
updateFromSaveResponse model response =
    case response of
        Err error ->
            ( { model | error = Just (errorDetails "Failed to save tap" error) }, Cmd.none )

        Ok data ->
            ( { model | mutation = toPartial data }, navigateToTaps model.navKey )


updateFromResponse : Model -> Response -> Model
updateFromResponse model response =
    case response of
        Err error ->
            { model | error = Just (errorDetails "Failed to fetch data from WeightyBeer API" error) }

        Ok data ->
            { model | brews = data.brews, weights = data.weights }


view : Model -> Html Msg
view model =
    div [ class "single-card-page-container", class "edit-tap" ]
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
