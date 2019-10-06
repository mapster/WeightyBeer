module Page.NewBrew exposing (Model, Msg, getError, init, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.EditBrew exposing (navigateToBrews)
import Component.ErrorDetails exposing (ErrorDetails, errorDetails)
import Graphql.Http
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Maybe.Extra
import Route
import Type.Brew as Brew exposing (Brew, Image, PartialBrew, emptyPartial, toNewBrew, toPartial)


type alias Model =
    { navKey : Nav.Key
    , editModel : Component.EditBrew.Model
    , error : Maybe ErrorDetails
    }


type Msg
    = Save
    | Cancel
    | GotSaveResponse SaveResponse
    | EditBrewMsg Component.EditBrew.InternalMsg


type alias SaveResponse =
    Result (Graphql.Http.Error ()) Brew


getError : Model -> Maybe ErrorDetails
getError model =
    Maybe.Extra.or model.error model.editModel.error


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
    let
        ( editModel, editCmd ) =
            Component.EditBrew.init emptyPartial
    in
    ( Model navKey editModel Nothing, Cmd.map EditBrewMsg editCmd )


makeSaveRequest : Model -> ( Model, Cmd Msg )
makeSaveRequest model =
    case toNewBrew model.editModel.mutation of
        Just brew ->
            ( model, Brew.makeMutationRequest (Brew.createRequest brew Brew.brewSelection) GotSaveResponse )

        Nothing ->
            ( { model | error = Just (ErrorDetails "Cannot save: incomplete tap" Nothing) }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Save ->
            makeSaveRequest model

        GotSaveResponse response ->
            updateFromSaveResponse model response

        Cancel ->
            ( model, navigateToBrews model.navKey )

        EditBrewMsg editMsg ->
            let
                ( editModel, editCmd ) =
                    Component.EditBrew.update editMsg model.editModel
            in
            ( { model | editModel = editModel }, Cmd.map EditBrewMsg editCmd )


updateFromSaveResponse : Model -> SaveResponse -> ( Model, Cmd Msg )
updateFromSaveResponse model response =
    case response of
        Err error ->
            ( { model | error = Just (errorDetails "Failed to save brew" error) }, Cmd.none )

        Ok data ->
            ( { model | editModel = Component.EditBrew.updateMutation model.editModel (toPartial data) }, navigateToBrews model.navKey )


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
