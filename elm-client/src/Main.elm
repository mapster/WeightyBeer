module Main exposing (..)

import Browser
import Home
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (class, href)
import Utils exposing (textEl)

main =
    Browser.document
        { init = init
        , view = \model -> { title = "WeightyBeer", body = [view model] }
        , update = update
        , subscriptions = subscriptions
        }

type Msg
    = HomeMsg Home.Msg

type alias Model =
    { home: Home.Model
    }

init : () -> (Model, Cmd Msg)
init _ =
    let
        (homeModel, homeCmd) = Home.init()
    in
    (
        { home = homeModel }
        , Cmd.map HomeMsg homeCmd
    )

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        HomeMsg homeMsg ->
            let
                (updModel, cmd) = Home.update homeMsg model.home
            in
                ({ model | home = updModel }, Cmd.map HomeMsg cmd)

subscriptions : Model -> Sub Msg
subscriptions model =
    Home.subscriptions model.home
        |> Sub.map HomeMsg

view : Model -> Html Msg
view model =
    div [ class "page-container" ]
        [ viewMenu
        , div [ class "vertical-space" ] []
        , Html.map HomeMsg (Home.view model.home)
        , div [ class "vertical-space" ] []
        ]


viewMenu : Html Msg
viewMenu =
    div [ class "page-menu"]
        [ div [ class "entries" ]
            [ viewMenuEntry "Home"
            , viewMenuEntry "Taps"
            , viewMenuEntry "Brews"
            , viewMenuEntry "Weight Hub"
            ]
        , div [ class "space"] []
        ]

viewMenuEntry : String -> Html Msg
viewMenuEntry title =
    div [ class "entry" ]
        [ a [ href "/tst" ] [ textEl title ] ]