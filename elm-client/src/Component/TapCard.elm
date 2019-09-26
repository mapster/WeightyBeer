module Component.TapCard exposing (view)

import Html exposing (Attribute, Html, div, hr, text)

import Html.Attributes exposing (class, style)
import String exposing (fromFloat, fromInt)
import Type.Tap exposing (Brew, Tap)
import Utils exposing (textClass, textEl)

view : Maybe Tap -> Html msg
view tap =
     div [ class "tap-card" ]
        [ viewTapCardHeader tap
        , viewTapCardBody <| Maybe.andThen .brew tap
        , viewTapCardFooter tap
        ]

viewTapCardHeader : Maybe Tap -> Html msg
viewTapCardHeader tap =
    div [ class "tap-card-header" ]
        [ div [ class "tap-card-indent"]
            [ text <| Maybe.withDefault "" <| Maybe.map .name tap]
        ]

viewTapCardBody : Maybe Brew -> Html msg
viewTapCardBody brew =
    div (tapCardBodyAttrs brew) [ div [ class "abvText" ] [ abvText brew ] ]

tapCardBodyAttrs : Maybe Brew -> List (Attribute msg)
tapCardBodyAttrs brew =
    let
        imageUrl =
            Maybe.andThen .image brew
                |> Maybe.withDefault "/img/fallback-brew-image.png"
    in
        (style "background-image" ("url(" ++ imageUrl ++ ")")) :: [ class "tap-card-body" ]

abvText : Maybe Brew -> Html msg
abvText brew =
    Maybe.map .abv brew
        |> Maybe.map fromFloat
        |> Maybe.map (\abv -> "ABV " ++ abv ++ "%")
        |> Maybe.withDefault ""
        |> textClass [ "tap-card-indent" ]

viewTapCardFooter : Maybe Tap -> Html msg
viewTapCardFooter tap =
    div [ class "tap-card-footer tap-card-indent" ]
        <| case Maybe.andThen .brew tap of
            Nothing ->
                [textEl "No brew on tap"]

            Just brew ->
                [ textClass [ "title" ] brew.name
                , textClass [ "subtitle" ] <| "Brew #" ++ (fromInt brew.brewNumber) ++ " - " ++ brew.style
                , hr [ class "divider" ] []
                , viewWeight tap
                ]

viewWeight : Maybe Tap -> Html msg
viewWeight maybeTap =
    textEl (case maybeTap of
        Just tap ->
            case tap.weight of
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
                Nothing ->
                    "No weight selected for tap"
        Nothing ->
            ""
    )
