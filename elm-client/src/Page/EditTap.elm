module Page.EditTap exposing (Model, Msg, getError, init, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.EditTap exposing (Field(..), TapMutation, applyMutation, emptyMutation)
import Component.ErrorDetails exposing (ErrorDetails, errorDetails)
import Constants exposing (weightyBeerHost)
import Graphql.Http exposing (RawError(..))
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Maybe exposing (Maybe)
import Route
import Type.BrewID as BrewID exposing (BrewID)
import Type.Tap exposing (Brew, Tap, Weight, brewSelection, tapSelection, updateTapRequest, weightSelection)
import Type.TapID as TapID exposing (TapID)
import Type.WeightID as WeightID exposing (WeightID)
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
    { original : Tap
    , brews : List Brew
    , weights : List Weight
    , mutation : TapMutation
    , error : Maybe ErrorDetails
    }


type alias Response =
    Result (Graphql.Http.Error ()) ResponseData


type alias SaveResponse =
    Result (Graphql.Http.Error ()) (Maybe Tap)


type alias ResponseData =
    { tap : Maybe Tap
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


makeUpdateRequest : State -> Cmd Msg
makeUpdateRequest state =
    case state of
        EditTap { mutation, original } ->
            updateTapRequest (applyMutation original mutation) tapSelection GotSaveResponse

        _ ->
            Cmd.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotResponse response ->
            ( { model | state = updateFromResponse response model.state }, Cmd.none )

        GotSaveResponse saveResponse ->
            ( { model | state = updateFromSaveResponse saveResponse model.state }, Cmd.none )

        Edit field value ->
            ( { model | state = updateField field value model.state }, Cmd.none )

        Save ->
            ( model, makeUpdateRequest model.state )

        Cancel ->
            ( model, Route.replaceUrl model.navKey Route.Taps )


updateFromSaveResponse : SaveResponse -> State -> State
updateFromSaveResponse response state =
    case response of
        Err error ->
            case state of
                EditTap editModel ->
                    EditTap { editModel | error = Just (errorDetails "Failed to update tap" error) }

                _ ->
                    Error <| errorDetails "Invalid state: got a save tap error response" error

        Ok data ->
            case ( data, state ) of
                ( Just tap, EditTap editModel ) ->
                    EditTap { editModel | original = tap, mutation = emptyMutation, error = Nothing }

                ( Just _, _ ) ->
                    Error <| ErrorDetails "Invalid state: got a save tap response" Nothing

                ( Nothing, EditTap editModel ) ->
                    EditTap { editModel | error = Just (ErrorDetails "Failed to update tap: doesn't exist" Nothing) }

                ( Nothing, Error _ ) ->
                    state

                ( Nothing, Loading ) ->
                    Error <| ErrorDetails "Failed to update tap: doesn't exist" Nothing


updateFromResponse : Response -> State -> State
updateFromResponse response state =
    case response of
        Err error ->
            Error <| errorDetails "Failed to fetch data from WeightyBeer API" error

        Ok data ->
            case ( data.tap, state ) of
                ( Just original, Loading ) ->
                    EditTap (EditModel original data.brews data.weights emptyMutation Nothing)

                ( Just original, Error _ ) ->
                    EditTap (EditModel original data.brews data.weights emptyMutation Nothing)

                ( Just original, EditTap editModel ) ->
                    EditTap { editModel | original = original, brews = data.brews, weights = data.weights, error = Nothing }

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

        EditTap { original, brews, weights, mutation } ->
            let
                updatedMutation =
                    case field of
                        Component.EditTap.Name ->
                            { mutation | name = justIfChanged original.name value }

                        Component.EditTap.Volume ->
                            { mutation
                                | volume =
                                    String.toFloat value
                                        |> Maybe.withDefault original.volume
                                        |> justIfChanged original.volume
                            }

                        Component.EditTap.Order ->
                            { mutation
                                | order =
                                    String.toInt value
                                        |> Maybe.withDefault original.order
                                        |> justIfChanged original.order
                            }

                        Component.EditTap.Brew ->
                            { mutation
                                | brew =
                                    List.filter (.id >> BrewID.eq value) brews
                                        |> List.head
                                        |> justIfChanged original.brew
                            }

                        Component.EditTap.Weight ->
                            { mutation
                                | weight =
                                    List.filter (.id >> WeightID.eq value) weights
                                        |> List.head
                                        |> justIfChanged original.weight
                            }
            in
            EditTap (EditModel original brews weights updatedMutation Nothing)


justIfChanged : a -> a -> Maybe a
justIfChanged original value =
    if original == value then
        Nothing

    else
        Just value


view : Model -> Html Msg
view model =
    case model.state of
        Loading ->
            div [] []

        Error e ->
            div [] [ text e.message ]

        EditTap { original, brews, weights, mutation } ->
            div [ class "edit-tap-page-container" ]
                [ Html.map mapEditTapMsg <| Component.EditTap.view original brews weights mutation
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
