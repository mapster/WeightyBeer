module Page.EditTap exposing (Model, Msg, init, subscriptions, update, view)

import Component.TapCard as TapCard
import Graphql.Http
import Html exposing (Html, div, form, hr, input, label, text)
import Html.Attributes as Attr exposing (class, for)
import RemoteData exposing (RemoteData)
import Type.Tap exposing (Tap, tapSelection)
import Type.TapID as TapID exposing (TapID)
import WeightyBeer.Query as Query

type alias Model =
    TapResponse

type alias TapResponse =
    RemoteData (Graphql.Http.Error (Maybe Tap)) (Maybe Tap)

type Msg
    = GotTapResponse TapResponse


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none

init : TapID -> (Model, Cmd Msg)
init id =
    (RemoteData.Loading, requestTap id)

requestTap : TapID -> Cmd Msg
requestTap id =
    Query.tap (TapID.toArg id) tapSelection
        |> Graphql.Http.queryRequest "http://localhost:3000/graphql"
        |> Graphql.Http.send ( RemoteData.fromResult >> GotTapResponse )

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    (model, Cmd.none)

fromRemote : TapResponse -> Maybe Tap
fromRemote response =
    case response of
        RemoteData.Success tap ->
            tap

        _ ->
            Nothing

--mm : Maybe Tap -> Html Msg
--mm maybe =
--    case maybe of
--        Just tap ->
--            viewTapCard tap
--
--        Nothing ->
--            textEl "bla"

view : Model -> Html Msg
view model =
    div [ class "edit-tap-container" ]
        [ div [ class "edit-tap-card" ]
            [ div [ class "column" ] [ viewForm model ]
            , div [ class "column debug" ] [ TapCard.view Nothing ]
            ]
        ]

viewForm : Model -> Html Msg
viewForm model =
    form [ class "form" ]
        [ viewField "Name" "Venstre kran"
        , viewField "Brew on tap" "#14 Brakkvann"
        , viewField "Keg weight" "tap3"
        , viewField "Volume (L)" "19"
        , viewField "Order" "1"
        ]

viewField : String -> String -> Html Msg
viewField field value =
    div [ class "field" ]
        [ label [ for (fieldId field) ] [ text field ]
        , input [ Attr.value value ] []
        , hr [ class "divider "] []
        ]


fieldId : String -> String
fieldId name =
    "field-" ++ name