module Component.TapCard exposing (view)

import Html exposing (Attribute, Html, div, hr, text)

import Html.Attributes exposing (class, style)
import String exposing (fromFloat, fromInt)
import Type.ModifiableValue as Value exposing (Value)
import Type.Tap exposing (Brew, PartialTap, Tap)
import Utils exposing (textClass, textEl)

view : PartialTap -> Html msg
view tap =
     div [ class "tap-card" ]
        [ viewTapCardHeader tap
        , viewTapCardBody <| Value.toMaybe tap.brew
        , viewTapCardFooter tap
        ]

viewTapCardHeader : PartialTap -> Html msg
viewTapCardHeader tap =
    div [ class "tap-card-header" ]
        [ div [ class "tap-card-indent"]
            [ text <| Value.toString tap.name]
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

viewTapCardFooter : PartialTap -> Html msg
viewTapCardFooter tap =
    div [ class "tap-card-footer tap-card-indent" ]
        <| case Value.toMaybe tap.brew of
            Nothing ->
                [textEl "No brew on tap"]

            Just brew ->
                [ textClass [ "title" ] brew.name
                , textClass [ "subtitle" ] <| "Brew #" ++ (fromInt brew.brewNumber) ++ " - " ++ brew.style
                , hr [ class "divider" ] []
                , viewWeight tap
                ]

viewWeight : PartialTap -> Html msg
viewWeight tap =
    textEl
        (case (Value.toMaybe tap.weight, Value.toMaybe tap.volume) of
            (Just weight, Just volume) ->
                String.concat
                    [ "Remaining: "
                    , fromInt weight.percent
                    , "% ("
                    , fromFloat <| volume * (toFloat weight.percent) / 100.0
                    , "/"
                    , fromFloat volume
                    , " L)"
                    ]

            (Nothing, Just _) ->
                "No weight selected for tap"

            (Nothing, Nothing) ->
                "No weight nor volume selected for tap"

            (Just _, Nothing) ->
                "No volume selected for tap"
        )
