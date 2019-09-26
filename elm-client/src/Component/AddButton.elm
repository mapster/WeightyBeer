module Component.AddButton exposing (view)

import Html exposing (Html, a, text)
import Html.Attributes exposing (class)
import Route exposing (Route)


view : Route -> Html msg
view route =
    a [ Route.href route, class "add-button" ] [ text "+" ]
