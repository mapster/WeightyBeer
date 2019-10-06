module Component.Button exposing (view, withIcon)

import Component.Icon exposing (Icon, icon)
import Html exposing (Html)
import Html.Attributes exposing (class, type_)
import Html.Events exposing (onClick)


view : msg -> String -> Html msg
view msg text =
    button msg (Html.text text)


withIcon : msg -> Icon -> Html msg
withIcon msg iconType =
    button msg (icon iconType)


button : msg -> Html msg -> Html msg
button msg child =
    Html.button
        [ type_ "button"
        , onClick msg
        , class "button-component"
        ]
        [ child ]
