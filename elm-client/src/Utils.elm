module Utils exposing (and, emptyAsNothing, textClass, textEl)

import Html exposing (Html, span, text)
import Html.Attributes exposing (class)


textEl : String -> Html msg
textEl string =
    textClass [] string


textClass : List String -> String -> Html msg
textClass classes string =
    span (List.map class classes) [ text string ]


and : (a -> Bool) -> (a -> Bool) -> a -> Bool
and p1 p2 arg =
    p1 arg && p2 arg


emptyAsNothing : String -> Maybe String
emptyAsNothing str =
    case String.isEmpty str of
        True ->
            Nothing

        False ->
            Just str
