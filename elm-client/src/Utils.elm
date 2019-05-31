module Utils exposing (..)

import Html exposing (Html, span, text)
import Html.Attributes exposing (class)

textEl : String -> Html msg
textEl string =
    textClass [] string

textClass : List String -> String -> Html msg
textClass classes string =
    span (List.map class classes) [ text string ]