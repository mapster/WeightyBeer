module Page.NewTap exposing (Model, Msg(..), getError, init, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.EditTap
import Component.ErrorDetails exposing (ErrorDetails)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Type.Tap exposing (emptyPartial)


type alias Model =
    { navKey : Nav.Key
    }


type Msg
    = Something


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
    ( Model navKey, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


getError : Model -> Maybe ErrorDetails
getError _ =
    Nothing


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "edit-tap-page-container" ]
        [ Html.map mapEditTapMsg <| Component.EditTap.view [] [] emptyPartial
        ]

mapEditTapMsg : Component.EditTap.Msg -> Msg
mapEditTapMsg _ =
    Something