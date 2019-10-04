module Page.Brews exposing (Model, Msg, init, subscriptions, update, view)

import Component.AddButton as AddButton
import Component.Table exposing (viewTable)
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (class)
import RemoteData exposing (RemoteData)
import Route exposing (href)
import String
import Type.BrewID as BrewID exposing (BrewID)
import WeightyBeer.Object
import WeightyBeer.Object.Brew
import WeightyBeer.Object.Image
import WeightyBeer.Query as Query


type Msg
    = GotBrewsResponse BrewsResponse


type alias Model =
    BrewsResponse


type alias Brew =
    { id : BrewID
    , name : String
    , brewNumber : Int
    , style : String
    , imageUrl : Maybe String
    }


type alias Brews =
    List Brew


type alias BrewsResponse =
    RemoteData (Graphql.Http.Error Brews) Brews


requestBrews : Cmd Msg
requestBrews =
    brewsQuery
        |> Graphql.Http.queryRequest "http://localhost:3000/graphql"
        |> Graphql.Http.send (RemoteData.fromResult >> GotBrewsResponse)


brewsQuery : SelectionSet Brews RootQuery
brewsQuery =
    Query.brews brewSelection


brewSelection : SelectionSet Brew WeightyBeer.Object.Brew
brewSelection =
    SelectionSet.map5 Brew
        BrewID.selection
        WeightyBeer.Object.Brew.name
        WeightyBeer.Object.Brew.brewNumber
        WeightyBeer.Object.Brew.style
        (WeightyBeer.Object.Brew.image WeightyBeer.Object.Image.url)


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


init : ( Model, Cmd Msg )
init =
    ( RemoteData.Loading, requestBrews )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    case msg of
        GotBrewsResponse response ->
            ( response, Cmd.none )


view model =
    div [ class "brews-container" ]
        [ AddButton.view Route.NewBrew
        , case model of
            RemoteData.Loading ->
                div [] []

            RemoteData.NotAsked ->
                div [] []

            RemoteData.Failure e ->
                text "Failed to fetch brews "

            RemoteData.Success brews ->
                viewBrews brews
        ]


viewBrews : Brews -> Html Msg
viewBrews brews =
    viewTable
        [ ( "Brew", .brewNumber >> String.fromInt >> (++) "#" >> text )
        , ( "Name", .name >> text )
        , ( "Style", .style >> text )
        , ( "", .id >> viewEditLink )
        ]
        brews


viewEditLink : BrewID -> Html Msg
viewEditLink id =
    a [ class "symbol-link", href (Route.EditBrew id) ] [ text "✎" ]
