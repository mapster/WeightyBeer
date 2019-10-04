module Page.EditTap exposing (Model, Msg, getError, init, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.EditTap exposing (Field(..))
import Component.ErrorDetails exposing (ErrorDetails, errorDetails)
import Constants exposing (weightyBeerHost)
import Graphql.Http exposing (RawError(..))
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Maybe exposing (Maybe)
import Route
import Type.Brew exposing (Brew, brewSelection)
import Type.Tap as Tap exposing (ExistingTap, PartialTap, Weight, tapSelection, toExistingTap, toPartial, updateOriginals, weightSelection)
import Type.TapID as TapID exposing (TapID)
import WeightyBeer.Query as Query


type alias Model =
    { navKey : Nav.Key
    , state : State
    }


type State
    = EditTap EditModel
    | Error ErrorDetails
    | Loading


type alias EditModel =
    { brews : List Brew
    , weights : List Weight
    , mutation : PartialTap
    , error : Maybe ErrorDetails
    }


type alias Response =
    Result (Graphql.Http.Error ()) ResponseData


type alias SaveResponse =
    Result (Graphql.Http.Error ()) (Maybe ExistingTap)


type alias ResponseData =
    { tap : Maybe ExistingTap
    , brews : List Brew
    , weights : List Weight
    }


type Msg
    = GotResponse Response
    | GotSaveResponse SaveResponse
    | Edit Field String
    | Save
    | Cancel


getError : Model -> Maybe ErrorDetails
getError { state } =
    case state of
        EditTap editModel ->
            editModel.error

        Error errorDetails ->
            Just errorDetails

        Loading ->
            Nothing


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


init : Nav.Key -> TapID -> ( Model, Cmd Msg )
init navKey id =
    ( Model navKey Loading, requestTap id )


requestTap : TapID -> Cmd Msg
requestTap id =
    SelectionSet.map3 ResponseData
        (Query.tap (TapID.toArg id) tapSelection)
        (Query.brews brewSelection)
        (Query.weights weightSelection)
        |> Graphql.Http.queryRequest weightyBeerHost
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> GotResponse)


makeUpdateRequest : Model -> ( Model, Cmd Msg )
makeUpdateRequest model =
    case model.state of
        EditTap edit ->
            case toExistingTap edit.mutation of
                Just tap ->
                    ( model, Tap.makeMutationRequest (Tap.updateRequest tap tapSelection) GotSaveResponse )

                Nothing ->
                    ( { model | state = EditTap { edit | error = Just (ErrorDetails "Cannot save: incomplete tap" Nothing) } }, Cmd.none )

        _ ->
            ( { model | state = Error (ErrorDetails "Cannot save: Tap data missing" Nothing) }, Cmd.none )


navigateToTaps : Nav.Key -> Cmd Msg
navigateToTaps =
    Route.replaceUrl Route.Taps


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotResponse response ->
            ( { model | state = updateFromResponse response model.state }, Cmd.none )

        GotSaveResponse saveResponse ->
            updateFromSaveResponse saveResponse model

        Edit field value ->
            ( { model | state = updateField field value model.state }, Cmd.none )

        Save ->
            makeUpdateRequest model

        Cancel ->
            ( model, navigateToTaps model.navKey )


updateFromSaveResponse : SaveResponse -> Model -> ( Model, Cmd Msg )
updateFromSaveResponse response model =
    let
        ( newState, cmd ) =
            case response of
                Err error ->
                    case model.state of
                        EditTap editModel ->
                            ( EditTap { editModel | error = Just (errorDetails "Failed to update tap" error) }, Cmd.none )

                        _ ->
                            ( Error <| errorDetails "Invalid state: got a save tap error response" error, Cmd.none )

                Ok data ->
                    case ( data, model.state ) of
                        ( Just tap, EditTap editModel ) ->
                            ( EditTap { editModel | mutation = toPartial tap, error = Nothing }, navigateToTaps model.navKey )

                        ( Just _, _ ) ->
                            ( Error <| ErrorDetails "Invalid state: got a save tap response" Nothing, Cmd.none )

                        ( Nothing, EditTap editModel ) ->
                            ( EditTap { editModel | error = Just (ErrorDetails "Failed to update tap: doesn't exist" Nothing) }, Cmd.none )

                        ( Nothing, Error _ ) ->
                            ( model.state, Cmd.none )

                        ( Nothing, Loading ) ->
                            ( Error <| ErrorDetails "Failed to update tap: doesn't exist" Nothing, Cmd.none )
    in
    ( { model | state = newState }, cmd )


updateFromResponse : Response -> State -> State
updateFromResponse response state =
    case response of
        Err error ->
            Error <| errorDetails "Failed to fetch data from WeightyBeer API" error

        Ok data ->
            case ( data.tap, state ) of
                ( Just original, Loading ) ->
                    EditTap (EditModel data.brews data.weights (toPartial original) Nothing)

                ( Just original, Error _ ) ->
                    EditTap (EditModel data.brews data.weights (toPartial original) Nothing)

                ( Just original, EditTap editModel ) ->
                    EditTap { editModel | mutation = updateOriginals editModel.mutation original, brews = data.brews, weights = data.weights, error = Nothing }

                ( Nothing, Error error ) ->
                    Error <| { error | message = "Tap doesn't exist" }

                ( Nothing, Loading ) ->
                    Error <| ErrorDetails "Tap doesn't exist" Nothing

                ( Nothing, EditTap editModel ) ->
                    EditTap { editModel | error = Just (ErrorDetails "Tap was deleted remotely" Nothing) }


updateField : Field -> String -> State -> State
updateField field value model =
    case model of
        Error _ ->
            model

        Loading ->
            Error <| ErrorDetails "Cannot edit while loading!" Nothing

        EditTap { brews, weights, mutation } ->
            let
                updatedMutation =
                    Component.EditTap.update brews weights mutation field value
            in
            EditTap (EditModel brews weights updatedMutation Nothing)


view : Model -> Html Msg
view model =
    case model.state of
        Loading ->
            div [] []

        Error e ->
            div [] [ text e.message ]

        EditTap { brews, weights, mutation } ->
            div [ class "edit-tap-page-container" ]
                [ Html.map mapEditTapMsg <| Component.EditTap.view brews weights mutation
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
