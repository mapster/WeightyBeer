module Component.Icon exposing (Icon(..), icon)

import Html exposing (Attribute, Html, text)
import Html.Attributes as Html


type Icon
    = FavoriteOutline
    | Favorite
    | Delete
    | Refresh


icon : Icon -> Html msg
icon kind =
    Html.i [ class kind ] []


class : Icon -> Attribute msg
class kind =
    let
        name =
            case kind of
                FavoriteOutline ->
                    "favorite-outline"

                Favorite ->
                    "favorite"

                Delete ->
                    "delete"

                Refresh ->
                    "refresh"
    in
    Html.class <| "zmdi zmdi-hc-lg zmdi-" ++ name
