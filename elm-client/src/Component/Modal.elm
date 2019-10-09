module Component.Modal exposing (view)

import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick, stopPropagationOn)
import Json.Decode


view : msg -> Html msg -> Html msg
view msg children =
    div [ class "modal", onClick msg ]
        [ div
            [ class "modal-container", stopPropagationOn "click" (Json.Decode.succeed ( msg, False )) ]
            [ children ]
        ]
