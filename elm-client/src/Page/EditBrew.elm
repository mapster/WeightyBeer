module Page.EditBrew exposing (Model, Msg(..), getError, init, mapEditBrewMsg, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.EditBrew exposing (navigateToBrews)
import Component.ErrorDetails exposing (ErrorDetails, errorDetails)
import Constants exposing (weightyBeerGraphql)
import Graphql.Http
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Maybe.Extra
import Type.Brew as Brew exposing (Brew, brewSelection, emptyPartial, toBrew, toPartial)
import Type.BrewID as BrewID exposing (BrewID)
import Type.Page exposing (Page)
import WeightyBeer.Query as Query


page : Page Model Msg BrewID
page =
    Page init view update subscriptions getError


type Msg
    = Save
    | Cancel
    | EditBrewMsg Component.EditBrew.InternalMsg
    | GotGetResponse Response
    | GotSaveResponse Response


type alias Model =
    { navKey : Nav.Key
    , editModel : Component.EditBrew.Model
    , error : Maybe ErrorDetails
    }


type alias Response =
    Result (Graphql.Http.Error ()) (Maybe Brew)


getError : Model -> Maybe ErrorDetails
getError model =
    Maybe.Extra.or model.error model.editModel.error


init : Nav.Key -> BrewID -> ( Model, Cmd Msg )
init navKey id =
    let
        ( editModel, editCmd ) =
            Component.EditBrew.init emptyPartial
    in
    ( Model navKey editModel Nothing, Cmd.batch [ requestBrew id, Cmd.map EditBrewMsg editCmd ] )


makeSaveRequest : Model -> ( Model, Cmd Msg )
makeSaveRequest model =
    case toBrew model.editModel.mutation of
        Just brew ->
            ( model, Brew.makeMutationRequest (Brew.updateRequest brew Brew.brewSelection) GotSaveResponse )

        Nothing ->
            ( { model | error = Just (ErrorDetails "Cannot save: incomplete tap" Nothing) }, Cmd.none )


requestBrew : BrewID -> Cmd Msg
requestBrew id =
    Query.brew (BrewID.toArg id) brewSelection
        |> Graphql.Http.queryRequest weightyBeerGraphql
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> GotGetResponse)


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Save ->
            makeSaveRequest model

        Cancel ->
            ( model, navigateToBrews model.navKey )

        EditBrewMsg editMsg ->
            let
                ( editModel, editCmd ) =
                    Component.EditBrew.update editMsg model.editModel
            in
            ( { model | editModel = editModel }, Cmd.map EditBrewMsg editCmd )

        GotGetResponse response ->
            ( updateFromGetResponse model response, Cmd.none )

        GotSaveResponse response ->
            updateFromSaveResponse model response


updateFromSaveResponse : Model -> Response -> ( Model, Cmd Msg )
updateFromSaveResponse model response =
    case response of
        Ok result ->
            case result of
                Just brew ->
                    ( { model | editModel = Component.EditBrew.updateMutation model.editModel (toPartial brew) }, navigateToBrews model.navKey )

                Nothing ->
                    ( { model | error = Just (ErrorDetails "Cannot save: Brew doesn't exist" Nothing) }, Cmd.none )

        Err error ->
            ( { model | error = Just (errorDetails "Cannot save: unknown error" error) }, Cmd.none )


updateFromGetResponse : Model -> Response -> Model
updateFromGetResponse model response =
    case response of
        Ok result ->
            case result of
                Just brew ->
                    { model | editModel = Component.EditBrew.updateMutation model.editModel (toPartial brew) }

                Nothing ->
                    { model | error = Just (ErrorDetails "Brew doesn't exist" Nothing) }

        Err error ->
            { model | error = Just (errorDetails "Failed to fetch brew from WeightyBeer API" error) }


view : Model -> Html Msg
view model =
    div [ class "single-card-page-container" ]
        [ Html.map mapEditBrewMsg <| Component.EditBrew.view model.editModel
        ]


mapEditBrewMsg : Component.EditBrew.Msg -> Msg
mapEditBrewMsg msg =
    case msg of
        Component.EditBrew.Save ->
            Save

        Component.EditBrew.Cancel ->
            Cancel

        Component.EditBrew.Internal internalMsg ->
            EditBrewMsg internalMsg
