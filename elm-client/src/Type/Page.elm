module Type.Page exposing (..)

import Browser.Navigation as Nav
import Component.ErrorDetails exposing (ErrorDetails)
import Html exposing (Html)


type alias Page model msg arg =
    { init : Nav.Key -> arg -> ( model, Cmd msg )
    , view : model -> Html msg
    , update : msg -> model -> ( model, Cmd msg )
    , subscriptions : model -> Sub msg
    , errors : model -> Maybe ErrorDetails
    }
