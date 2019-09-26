module Route exposing (Route(..), fromUrl, href, replaceUrl)

import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as Attr
import Type.TapID as TapID exposing (TapID)
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s)


type Route
    = Home
    | Taps
    | EditTap TapID
    | NewTap


parser : Parser (Route -> a) a
parser =
    oneOf
        [ Parser.map Home Parser.top
        , Parser.map Taps (s "taps")
        , Parser.map NewTap (s "taps" </> s "_new")
        , Parser.map EditTap (s "taps" </> TapID.urlParser)
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

                NewTap ->
                    [ "taps", "_new" ]

                EditTap id ->
                    [ "taps", TapID.toString id ]
    in
    "/" ++ String.join "/" pieces


replaceUrl : Nav.Key -> Route -> Cmd msg
replaceUrl key route =
    Nav.replaceUrl key (routeToString route)
