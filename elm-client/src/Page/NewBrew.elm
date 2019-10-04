module Page.NewBrew exposing (Model, Msg, getError, init, subscriptions, update, view)

import Component.EditBrew exposing (Field)
import Component.ErrorDetails exposing (ErrorDetails)
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Type.Brew exposing (PartialBrew, emptyPartial)


type alias Model =
    { mutation : PartialBrew
    }


type Msg
    = Edit Field String
    | Something


getError : Model -> Maybe ErrorDetails
getError _ =
    Nothing


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


init : ( Model, Cmd Msg )
init =
    ( Model emptyPartial, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Edit field value ->
            ( { model | mutation = Component.EditBrew.update model.mutation field value }, Cmd.none )

        Something ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "edit-brew-page-container" ]
        [ Html.map mapEditBrewMsg <| Component.EditBrew.view model.mutation
        ]


mapEditBrewMsg : Component.EditBrew.Msg -> Msg
mapEditBrewMsg msg =
    case msg of
        Component.EditBrew.Edit field value ->
            Edit field value

        Component.EditBrew.Save ->
            Something

        Component.EditBrew.Cancel ->
            Something
