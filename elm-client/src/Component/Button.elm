module Component.Button exposing (view)

import Html exposing (Html, button)
import Html.Attributes exposing (class, type_)
import Html.Events exposing (onClick)


view : msg -> String -> Html msg
view msg text =
    button
        [ type_ "button"
        , onClick msg
        , class "button-component"
        ]
        [ Html.text text ]
