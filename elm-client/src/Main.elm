module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Home
import Html exposing (Html, a, div)
import Html.Attributes exposing (class)
import Route exposing (Route, href)
import Taps
import Url exposing (Url)
import Utils exposing (textEl)

main =
    Browser.application
        { init = init
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        , view = \model -> { title = "WeightyBeer", body = [view model] }
        , update = update
        , subscriptions = subscriptions
        }

type Msg
    = ChangedUrl Url
    | ClickedLink Browser.UrlRequest
    | ToPage PageMsg

type PageMsg
    = HomeMsg Home.Msg
    | TapsMsg Taps.Msg

type alias Model =
    { navKey : Nav.Key
    , route : Maybe Route
    , page: Page
    }

type Page
    = NotFound
    | Home Home.Model
    | Taps Taps.Model

setPage : Model -> Page -> Model
setPage model page =
    {model | page = page}

init : () -> Url -> Nav.Key -> (Model, Cmd Msg)
init _ url key =
    let
        route = Route.fromUrl url
        (page, cmd) = changeRouteTo route
    in
    (Model key route page, Cmd.map ToPage cmd)


changeRouteTo : Maybe Route -> (Page, Cmd PageMsg)
changeRouteTo maybeRoute =
    case maybeRoute of
        Nothing ->
            (NotFound, Cmd.none)

        Just Route.Home ->
            Home.init
                |> updateWith Home HomeMsg

        Just Route.Taps ->
            Taps.init
                |> updateWith Taps TapsMsg

        Just (Route.EditTap id) ->
            (NotFound, Cmd.none)

updateWith : (srcModel -> targetModel) -> (srcMsg -> targetMsg) -> (srcModel, Cmd srcMsg) -> (targetModel, Cmd targetMsg)
updateWith modelMap cmdMap (page, cmd) =
    (modelMap page, Cmd.map cmdMap cmd)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ClickedLink urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.navKey (Url.toString url) )

                Browser.External href ->
                    (model, Nav.load href)

        ChangedUrl url ->
            changeRouteTo (Route.fromUrl url)
                |> updateWith (setPage model) ToPage

        ToPage pageMsg ->
            updatePage pageMsg model

updatePage : PageMsg -> Model -> (Model, Cmd Msg)
updatePage msg model =
    case msg of
        HomeMsg homeMsg ->
            case model.page of
                Home home ->
                    Home.update homeMsg home
                        |> updateWith (Home >> setPage model) (HomeMsg >> ToPage)

                _ -> (model, Cmd.none)

        TapsMsg tapsMsg ->
            case model.page of
                Taps taps ->
                    Taps.update tapsMsg taps
                        |> updateWith (Taps >> setPage model) (TapsMsg >> ToPage)

                _ -> (model, Cmd.none)

subscriptions : Model -> Sub Msg
subscriptions model =
    case model.page of
        Home home ->
            Sub.map (HomeMsg >> ToPage ) (Home.subscriptions home)

        _ ->
            Sub.none


view : Model -> Html Msg
view model =
    div [ class "app-container" ]
        [ viewMenu
        , div [ class "vertical-space" ] []
        , viewPage model.page
        , div [ class "vertical-space" ] []
        ]

viewPage : Page -> Html Msg
viewPage page =
    div [ class "page-container"] [
        case page of
            NotFound ->
                div [] [ textEl "Not found"]

            Home home ->
                Html.map (HomeMsg >> ToPage) (Home.view home)

            Taps taps ->
                Html.map (TapsMsg >> ToPage) (Taps.view taps)
    ]

viewMenu : Html Msg
viewMenu =
    div [ class "page-menu"]
        [ div [ class "entries" ]
            [ viewMenuEntry "Home" Route.Home
            , viewMenuEntry "Taps" Route.Taps
            , viewMenuEntry "Brews" Route.Taps
            , viewMenuEntry "Weight Hub" Route.Taps
            ]
        , div [ class "space"] []
        ]

viewMenuEntry : String -> Route -> Html Msg
viewMenuEntry title route =
    div [ class "entry" ]
        [ a [ href route ] [ textEl title ] ]