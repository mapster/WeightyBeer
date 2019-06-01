module Route exposing (Route(..), href, fromUrl)

import Html exposing (Attribute)
import Html.Attributes as Attr
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s)

type Route
    = Home
    | Taps
    | EditTap String

parser : Parser (Route -> a) a
parser =
    oneOf
        [ Parser.map Home Parser.top
        , Parser.map Taps (s "taps")
        , Parser.map EditTap (s "taps" </> Parser.string)
        ]

-- Public

href : Route -> Attribute msg
href targetRoute =
    Attr.href (routeToString targetRoute)

fromUrl : Url -> Maybe Route
fromUrl url =
    Parser.parse parser url


-- Internal
routeToString : Route -> String
routeToString route =
    let
        pieces =
            case route of
                Home ->
                    []

                Taps ->
                    [ "taps" ]

                EditTap id ->
                    [ "taps", id ]
    in
    "/" ++ String.join "/" pieces