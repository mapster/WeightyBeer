module Main exposing (..)

import Browser
import Dict exposing (Dict)
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Html exposing (..)
import Html.Attributes exposing (..)
import RemoteData exposing (RemoteData)
import String exposing (fromFloat, fromInt)
import Time
import WeightyBeer.Object
import WeightyBeer.Object.Brew
import WeightyBeer.Object.Image
import WeightyBeer.Object.Tap
import WeightyBeer.Object.Weight
import WeightyBeer.Query as Query

main =
    Browser.document
        { init = init
        , view = \model -> { title = "WeightyBeer", body = [view model] }
        , update = update
        , subscriptions = subscriptions
        }

type Msg
    = GotTapsResponse (RemoteData (Graphql.Http.Error Taps) Taps)
    | GotWeightsResponse (RemoteData (Graphql.Http.Error Weights) Weights)
    | FetchWeights

type alias Model =
    { receivedTaps: RemoteData (Graphql.Http.Error Taps) Taps
    , weights: Dict String Weight
    }

type alias Taps = List Tap
type alias Weights = List Weight

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

subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 1000 (\_ -> FetchWeights)

init : () -> (Model, Cmd Msg)
init _ =
    let
        model = Model RemoteData.Loading Dict.empty
    in
        (model, requestTaps)

--
-- GraphQL
--
--

requestTaps : Cmd Msg
requestTaps =
    tapsQuery
        |> Graphql.Http.queryRequest "http://localhost:3000/graphql"
        |> Graphql.Http.send ( RemoteData.fromResult >> GotTapsResponse )

requestWeights : Cmd Msg
requestWeights =
    Query.weights weightSelection
        |> Graphql.Http.queryRequest "http://localhost:3000/graphql"
        |> Graphql.Http.send ( RemoteData.fromResult >> GotWeightsResponse )

tapsQuery : SelectionSet (List Tap) RootQuery
tapsQuery =
    Query.taps tapSelection

tapSelection : SelectionSet Tap WeightyBeer.Object.Tap
tapSelection =
    SelectionSet.map6 Tap
        WeightyBeer.Object.Tap.id
        WeightyBeer.Object.Tap.name
        WeightyBeer.Object.Tap.order
        WeightyBeer.Object.Tap.volume
        (WeightyBeer.Object.Tap.brew brewSelection)
        (WeightyBeer.Object.Tap.weight weightSelection)

brewSelection : SelectionSet Brew WeightyBeer.Object.Brew
brewSelection =
    SelectionSet.map7 Brew
        WeightyBeer.Object.Brew.id
        WeightyBeer.Object.Brew.brewNumber
        WeightyBeer.Object.Brew.name
        WeightyBeer.Object.Brew.style
        WeightyBeer.Object.Brew.ibu
        WeightyBeer.Object.Brew.abv
        (WeightyBeer.Object.Brew.image imageSelection)

imageSelection : SelectionSet String WeightyBeer.Object.Image
imageSelection = WeightyBeer.Object.Image.url

weightSelection : SelectionSet Weight WeightyBeer.Object.Weight
weightSelection =
    SelectionSet.map2 Weight
        WeightyBeer.Object.Weight.id
        WeightyBeer.Object.Weight.percent

--
-- Update
--
--

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GotTapsResponse response ->
            ({ model | receivedTaps = response}, Cmd.none)

        GotWeightsResponse response ->
            ({ model | weights = updateWeights response }, Cmd.none)

        FetchWeights ->
            (model, requestWeights)

updateWeights : (RemoteData (Graphql.Http.Error Weights) Weights) -> Dict String Weight
updateWeights response =
    case response of
        RemoteData.Success weights ->
            List.map (\w -> (w.id, w)) weights
                |> Dict.fromList

        _ ->
            Dict.empty

--
-- View
--
--

view : Model -> Html Msg
view model =
    case model.receivedTaps of
        RemoteData.Loading ->
            text "Loading..."

        RemoteData.NotAsked ->
            text "Not asked!"


        RemoteData.Failure e ->
            text "Failed to fetch taps: "


        RemoteData.Success taps ->
                viewTaps model.weights taps

viewTaps : Dict String Weight -> Taps -> Html Msg
viewTaps weights taps =
    div [ class "tap-card-container" ] <| List.map (viewTapCard weights) taps

viewTapCard : Dict String Weight -> Tap -> Html Msg
viewTapCard weights tap =
     div [ class "tap-card" ]
        [ viewTapCardHeader tap
        , viewTapCardBody tap.brew
        , viewTapCardFooter weights tap
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

viewTapCardFooter : Dict String Weight -> Tap -> Html Msg
viewTapCardFooter weights tap =
    div [ class "tap-card-footer tap-card-indent debug" ]
        <| case tap.brew of
            Nothing ->
                [textEl "No brew on tap"]

            Just brew ->
                [ textClass [ "title" ] brew.name
                , textClass [ "subtitle" ] <| "Brew #" ++ (fromInt brew.brewNumber) ++ " - " ++ brew.style
                , hr [ class "title-divider" ] []
                , viewWeight weights tap
                ]

viewWeight : Dict String Weight -> Tap -> Html Msg
viewWeight weights tap =
    let
        weightMaybe = Maybe.map .id tap.weight
            |> Maybe.map (\id -> Dict.get id weights)
            |> Maybe.withDefault tap.weight
    in
    textEl (case weightMaybe of
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