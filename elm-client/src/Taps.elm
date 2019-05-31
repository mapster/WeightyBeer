module Taps exposing (view, init, update, Model, Msg, subscriptions)

import Html exposing (h1, text)
type Msg
    = Some

type alias Model =
    { field: String
    }

view model =
    h1 [] [ text <| "Taps: " ++ model.field ]

subscriptions : Model -> Sub Msg
subscriptions  _ =
    Sub.none

init : Model
init =
    Model "jadda"

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    (model, Cmd.none)

