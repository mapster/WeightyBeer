module Main exposing (..)

import Browser
--import Element exposing (Element, alignBottom, centerY, column, el, fill, fillPortion, height, htmlAttribute, image, inFront, maximum, none, paddingXY, px, rgb, rgba, row, shrink, spacing, text, width)
--import Element.Background as Background
--import Element.Border
--import Element.Font as Font
import Html exposing (..)
import Html.Attributes exposing (..)
import String exposing (fromFloat, fromInt)

main =
    Browser.document
        { init = init
        , view = \model -> { title = "WeightyBeer", body = [view model] }
        , update = update
        , subscriptions = \_ -> Sub.none
        }

type Msg
    = SomeMsg

type alias Model =
    { taps: List Tap
    }

type alias Tap =
    { id: String
    , name: String
    , order: Int
    , volume: Float
    , brew: Maybe Brew
    , weight: Maybe Weight
    }

type alias Weight =
    { id: String
    , percent: Int
    }

type alias Brew =
    { id: String
    , brewNumber: Int
    , name: String
    , style: String
    , ibu: Int
    , abv: Float
    , image: Maybe String
    }

init : () -> (Model, Cmd Msg)
init _ =
    let
        model = Model
            [ Tap "1" "Venstre kran" 0 19
                (Just <| Brew "1" 1 "Routsi's Frokost" "Coffee Stout" 87 7.4 (Just "/img/routsis-frokost.png"))
                (Just <| Weight "tap1" 83 )

            , Tap "2" "Midtre kran" 0 19
                              Nothing  --(Just <| Brew "2" 1 "My Coffee Stout" "Stout" 87 7.4 (Nothing)) -- Just "/img/routsis-frokost.png"
                              (Just <| Weight "tap2" 0 )

            , Tap "2" "Høyre kran" 0 19
                              (Just <| Brew "3" 2 "My Belgian Blonde" "Belgian Blonde" 87 9.2 Nothing)--(Just "/img/routsis-frokost.png"))
                              (Just <| Weight "tap3" 34 )
            ]
    in
        (model, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update _ model =
    (model, Cmd.none)

view : Model -> Html Msg
view model =
    viewTaps model.taps

viewTaps : List Tap -> Html Msg
viewTaps taps =
    div [ class "tap-card-container" ] <| List.map viewTapCard taps

viewTapCard : Tap -> Html Msg
viewTapCard tap =
     div [ class "tap-card" ]
        [ viewTapCardHeader tap
        , viewTapCardBody tap.brew
        , viewTapCardFooter tap
        ]

viewTapCardHeader : Tap -> Html Msg
viewTapCardHeader tap =
    div [ class "tap-card-header debug" ]
        [ div [ class "tap-card-indent"]
            [ text tap.name]
        ]

viewTapCardBody : Maybe Brew -> Html Msg
viewTapCardBody brew =
    div (tapCardBodyAttrs brew) [ div [ class "abvText" ] [ abvText brew ] ]

tapCardBodyAttrs : Maybe Brew -> List (Attribute Msg)
tapCardBodyAttrs brew =
    let
        imageUrl =
            Maybe.andThen .image brew
                |> Maybe.withDefault "/img/fallback-brew-image.png"
    in
        (style "background-image" ("url(" ++ imageUrl ++ ")")) :: [ class "tap-card-body debug" ]

abvText : Maybe Brew -> Html Msg
abvText brew =
    Maybe.map .abv brew
        |> Maybe.map fromFloat
        |> Maybe.map (\abv -> "ABV " ++ abv ++ "%")
        |> Maybe.withDefault ""
        |> textClass [ "tap-card-indent" ]

viewTapCardFooter : Tap -> Html Msg
viewTapCardFooter tap =
    div [ class "tap-card-footer tap-card-indent debug" ]
        <| case tap.brew of
            Nothing ->
                [textEl "No brew on tap"]

            Just brew ->
                [ textClass [ "title" ] brew.name
                , textClass [ "subtitle" ] <| "Brew #" ++ (fromInt brew.brewNumber) ++ " - " ++ brew.style
                , hr [ class "title-divider" ] []
                , viewWeight tap
                ]

viewWeight : Tap -> Html Msg
viewWeight tap =
    textEl (case tap.weight of
        Nothing ->
            "No weight selected for tap"

        Just weight ->
            String.concat
                [ "Remaining: "
                , fromInt weight.percent
                , "% ("
                , fromFloat <| tap.volume * (toFloat weight.percent) / 100.0
                , "/"
                , fromFloat tap.volume
                , " L)"
                ]
    )

textEl : String -> Html Msg
textEl string =
    textClass [] string

textClass : List String -> String -> Html Msg
textClass classes string =
    span (List.map class classes) [ text string ]