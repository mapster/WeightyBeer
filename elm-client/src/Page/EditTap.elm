module Page.EditTap exposing (Model, Msg, getError, init, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.ErrorDetails as ErrorDetails exposing (ErrorDetails, errorDetails)
import Component.Form as Form exposing (Field, InputType(..), Option, viewButtons, viewField, viewSelect)
import Component.TapCard as TapCard
import Constants exposing (weightyBeerHost)
import Graphql.Http exposing (RawError(..), discardParsedErrorData)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Html exposing (Html, div, form, text)
import Html.Attributes exposing (class)
import Maybe exposing (Maybe)
import Maybe.Extra
import Route
import String exposing (fromFloat, fromInt)
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


type Field
    = Name
    | Volume
    | Order
    | Brew
    | Weight


type alias TapMutation =
    { name : Maybe String
    , brew : Maybe (Maybe Brew)
    , weight : Maybe (Maybe Weight)
    , volume : Maybe Float
    , order : Maybe Int
    }


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


emptyMutation : TapMutation
emptyMutation =
    TapMutation Nothing Nothing Nothing Nothing Nothing


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
                        Name ->
                            { mutation | name = justIfChanged original.name value }

                        Volume ->
                            { mutation
                                | volume =
                                    String.toFloat value
                                        |> Maybe.withDefault original.volume
                                        |> justIfChanged original.volume
                            }

                        Order ->
                            { mutation
                                | order =
                                    String.toInt value
                                        |> Maybe.withDefault original.order
                                        |> justIfChanged original.order
                            }

                        Brew ->
                            { mutation
                                | brew =
                                    List.filter (.id >> BrewID.eq value) brews
                                        |> List.head
                                        |> justIfChanged original.brew
                            }

                        Weight ->
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
            div [] [ text "Loading..." ]

        Error e ->
            div [] [ text e.message ]

        EditTap { original, brews, weights, mutation } ->
            div [ class "edit-tap-page-container" ]
                [ div [ class "edit-tap-card" ]
                    [ div [ class "column" ]
                        [ viewForm mutation original brews weights ]
                    , div [ class "column" ]
                        (applyMutation original mutation
                            |> viewTapCardColumn
                        )
                    ]
                ]


viewTapCardColumn : Tap -> List (Html Msg)
viewTapCardColumn tap =
    [ div [ class "tap-card-container" ] [ TapCard.view (Just tap) ]
    , div [ class "vertical-space" ] []
    ]


viewForm : TapMutation -> Tap -> List Brew -> List Weight -> Html Msg
viewForm mutation original brews weights =
    let
        name =
            Field "Name" mutation.name (Just original.name)

        brew =
            Field "Brew on tap"
                (unwrap (.id >> BrewID.toString) mutation.brew)
                (Maybe.map (.id >> BrewID.toString) original.brew)

        weight =
            Field "Keg weight"
                (unwrap (.id >> WeightID.toString) mutation.weight)
                (Maybe.map (.id >> WeightID.toString) original.weight)

        volume =
            Field "Volume (L)" (Maybe.map fromFloat mutation.volume) (Just (fromFloat original.volume))

        order =
            Field "Order" (Maybe.map fromInt mutation.order) (Just (fromInt original.order))
    in
    form [ class "form" ]
        [ viewField name Text (Edit Name)
        , viewSelect brew (brewOptions brews) (Edit Brew)
        , viewSelect weight (weightOptions weights) (Edit Weight)
        , viewField volume Number (Edit Volume)
        , viewField order Number (Edit Order)
        , viewButtons Save Cancel (isModified original mutation)
        ]


isModified : Tap -> TapMutation -> Bool
isModified tap mutation =
    applyMutation tap mutation /= tap


unwrap : (a -> String) -> Maybe (Maybe a) -> Maybe String
unwrap toString mutation =
    Maybe.map (Maybe.Extra.unwrap "" toString) mutation


applyMutation : Tap -> TapMutation -> Tap
applyMutation tap mutation =
    Tap
        tap.id
        (Maybe.withDefault tap.name mutation.name)
        (Maybe.withDefault tap.order mutation.order)
        (Maybe.withDefault tap.volume mutation.volume)
        (Maybe.withDefault tap.brew mutation.brew)
        (Maybe.withDefault tap.weight mutation.weight)


brewOptions : List Brew -> List Option
brewOptions brews =
    List.map (\brew -> Option (BrewID.toString brew.id) ("#" ++ fromInt brew.brewNumber ++ " " ++ brew.name)) brews


weightOptions : List Weight -> List Option
weightOptions weights =
    List.map .id weights
        |> List.map WeightID.toString
        |> List.map (\weight -> Option weight weight)
