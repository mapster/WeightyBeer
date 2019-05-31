module Main exposing (..)

import Browser
import Home
import Html exposing (Html)

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
    Html.map HomeMsg (Home.view model.home)