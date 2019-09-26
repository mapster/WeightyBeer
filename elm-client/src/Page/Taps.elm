module Page.Taps exposing (Model, Msg, init, subscriptions, update, view)

import Component.AddButton as AddButton
import Component.Table exposing (viewTable)
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Html exposing (Html, a, div, span, text)
import Html.Attributes exposing (class)
import RemoteData exposing (RemoteData)
import Route exposing (href)
import String exposing (fromInt)
import Type.TapID as TapID exposing (TapID)
import WeightyBeer.Object
import WeightyBeer.Object.Brew
import WeightyBeer.Object.Tap
import WeightyBeer.Object.Weight
import WeightyBeer.Query as Query


type Msg
    = GotTapsResponse TapsResponse


type alias Model =
    TapsResponse


type alias Tap =
    { id : TapID
    , name : String
    , brew : Maybe Brew
    , weight : Maybe String
    , isActive : Bool
    }


type alias Brew =
    { brewNumber : Int
    , name : String
    }


type alias Taps =
    List Tap


type alias TapsResponse =
    RemoteData (Graphql.Http.Error Taps) Taps


requestTaps : Cmd Msg
requestTaps =
    tapsQuery
        |> Graphql.Http.queryRequest "http://localhost:3000/graphql"
        |> Graphql.Http.send (RemoteData.fromResult >> GotTapsResponse)


tapsQuery : SelectionSet (List Tap) RootQuery
tapsQuery =
    Query.taps tapSelection


tapSelection : SelectionSet Tap WeightyBeer.Object.Tap
tapSelection =
    SelectionSet.map5 Tap
        TapID.selection
        WeightyBeer.Object.Tap.name
        (WeightyBeer.Object.Tap.brew brewSelection)
        (WeightyBeer.Object.Tap.weight weightSelection)
        WeightyBeer.Object.Tap.isActive


brewSelection : SelectionSet Brew WeightyBeer.Object.Brew
brewSelection =
    SelectionSet.map2 Brew
        WeightyBeer.Object.Brew.brewNumber
        WeightyBeer.Object.Brew.name


weightSelection : SelectionSet String WeightyBeer.Object.Weight
weightSelection =
    WeightyBeer.Object.Weight.id


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


init : ( Model, Cmd Msg )
init =
    ( RemoteData.Loading, requestTaps )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    case msg of
        GotTapsResponse response ->
            ( response, Cmd.none )


view model =
    div [ class "taps-container" ]
        [ AddButton.view Route.NewTap
        , case model of
            RemoteData.Loading ->
                text "Loading..."

            RemoteData.NotAsked ->
                text "Not asked!"

            RemoteData.Failure e ->
                text "Failed to fetch taps: "

            RemoteData.Success taps ->
                viewTaps taps
        ]


viewTaps : Taps -> Html Msg
viewTaps taps =
    viewTable
        [ ( "Name", .name >> text )
        , ( "Brew on tap", .brew >> viewBrew )
        , ( "Keg weight", .weight >> viewWeight )
        , ( "Favorite", .isActive >> viewIsFavorite )
        , ( "", .id >> viewEditLink )
        ]
        taps


viewEditLink : TapID -> Html Msg
viewEditLink id =
    a [ class "symbol-link", href (Route.EditTap id) ] [ text "✎" ]


viewBrew : Maybe Brew -> Html Msg
viewBrew maybeBrew =
    case maybeBrew of
        Nothing ->
            span [] []

        Just brew ->
            text <| "#" ++ fromInt brew.brewNumber ++ " - " ++ brew.name


viewWeight : Maybe String -> Html Msg
viewWeight weight =
    Maybe.map text weight
        |> Maybe.withDefault (span [] [])


viewIsFavorite : Bool -> Html Msg
viewIsFavorite isFav =
    text
        (case isFav of
            False ->
                "False"

            True ->
                "True"
        )
