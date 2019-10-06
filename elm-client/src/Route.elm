module Route exposing (Route(..), fromUrl, href, replaceUrl)

import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as Attr
import Type.BrewID as BrewID exposing (BrewID)
import Type.TapID as TapID exposing (TapID)
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s)


type Route
    = Home
    | Taps
    | EditTap TapID
    | NewTap
    | Brews
    | EditBrew BrewID
    | NewBrew
    | WeightHub


parser : Parser (Route -> a) a
parser =
    oneOf
        [ Parser.map Home Parser.top
        , Parser.map Taps (s "taps")
        , Parser.map NewTap (s "taps" </> s "_new")
        , Parser.map EditTap (s "taps" </> TapID.urlParser)
        , Parser.map Brews (s "brews")
        , Parser.map NewBrew (s "brews" </> s "_new")
        , Parser.map EditBrew (s "brews" </> BrewID.urlParser)
        , Parser.map WeightHub (s "weighthub")
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

                Brews ->
                    [ "brews" ]

                EditBrew id ->
                    [ "brews", BrewID.toString id ]

                NewBrew ->
                    [ "brews", "_new" ]

                WeightHub ->
                    [ "weighthub" ]
    in
    "/" ++ String.join "/" pieces


replaceUrl : Route -> Nav.Key -> Cmd msg
replaceUrl route key =
    Nav.replaceUrl key (routeToString route)
