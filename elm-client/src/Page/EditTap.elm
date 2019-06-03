module Page.EditTap exposing (Model, Msg, init, subscriptions, update, view)

import Component.Form exposing (InputType(..), Option, viewField, viewSelect)
import Component.TapCard as TapCard
import Graphql.Http
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Html exposing (Html, div, form, text)
import Html.Attributes exposing (class)
import RemoteData exposing (RemoteData)
import String exposing (fromFloat, fromInt)
import Type.BrewID as BrewID
import Type.Tap exposing (Brew, Tap, Weight, brewSelection, tapSelection, weightSelection)
import Type.TapID as TapID exposing (TapID)
import Type.WeightID as WeightID
import WeightyBeer.Query as Query

type alias Model =
    { edit: TapMutation
    , response : TapResponse
    }

type alias Data =
    { tap: Maybe Tap
    , brews: List Brew
    , weights: List Weight
    }

type alias TapResponse =
    RemoteData (Graphql.Http.Error Data) Data

type Msg
    = GotTapResponse TapResponse
    | Edit Field String

type Field
    = Name
    | Volume
    | Order
    | Brew
    | Weight

type alias TapMutation =
    { name: Maybe String
    , brew: Maybe String
    , weight: Maybe String
    , volume: Maybe Float
    , order: Maybe Int
    }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none

init : TapID -> (Model, Cmd Msg)
init id =
    let
        edit = TapMutation Nothing Nothing Nothing Nothing Nothing
    in
    (Model edit RemoteData.Loading, requestTap id)


requestTap : TapID -> Cmd Msg
requestTap id =
    (SelectionSet.map3 Data
        (Query.tap (TapID.toArg id) tapSelection)
        (Query.brews brewSelection)
        (Query.weights weightSelection)
    )
        |> Graphql.Http.queryRequest "http://localhost:3000/graphql"
        |> Graphql.Http.send ( RemoteData.fromResult >> GotTapResponse )

toMutation : Tap -> TapMutation
toMutation tap =
    TapMutation
        (Just tap.name)
        (Maybe.map (.id >> BrewID.toString) tap.brew)
        (Maybe.map (.id >> WeightID.toString) tap.weight)
        (Just tap.volume)
        (Just tap.order)

fromMutation : TapID -> TapMutation -> List Brew -> List Weight -> Tap
fromMutation id mutation brews weights =
    let
        brew =
            case mutation.brew of
                Just mutationBrew ->
                    List.filter (\b -> (BrewID.toString b.id) == mutationBrew) brews
                        |> List.head

                Nothing -> Nothing

        weight =
            case mutation.weight of
                Just mutationWeight ->
                    List.filter (\w -> (WeightID.toString w.id) == mutationWeight) weights
                        |> List.head

                Nothing -> Nothing

    in
    Tap id
        (Maybe.withDefault "" mutation.name)
        (Maybe.withDefault 0 mutation.order)
        (Maybe.withDefault 0 mutation.volume)
        brew
        weight

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GotTapResponse response ->
            let
                mutation =
                    case response of
                        RemoteData.Success data ->
                            case data.tap of
                                Just tap ->
                                    toMutation tap

                                Nothing ->
                                    model.edit
                        _ ->
                            model.edit
            in
            ({ model | response = response, edit = mutation }, Cmd.none)

        Edit field value ->
            (updateField field value model, Cmd.none)

updateField : Field -> String -> Model -> Model
updateField field value model =
    let
        current = model.edit
        mutation =
            case field of
                Name ->
                    { current | name = Just value }

                Volume ->
                    { current | volume = String.toFloat value }

                Order ->
                    { current | order = String.toInt value }

                Brew ->
                    { current | brew = Just value }

                Weight ->
                    { current | weight = Just value }
    in
    { model | edit = mutation }

view : Model -> Html Msg
view model =
    case model.response of
        RemoteData.Success response ->
            case response.tap of
                Just tap ->
                    div [ class "edit-tap-page-container" ]
                        [ div [ class "edit-tap-card" ]
                            [ div [ class "column" ] [ viewForm model.edit response.brews response.weights ]
                            , div [ class "column" ] ( viewTapCardColumn (fromMutation tap.id model.edit response.brews response.weights))
                            ]
                        ]

                Nothing ->
                    div [] [ text "Tap does not exist" ]

        _ -> div [] [ text "error"]

viewTapCardColumn : Tap -> List (Html Msg)
viewTapCardColumn tap =
    [ div [ class "tap-card-container"] [ TapCard.view (Just tap) ]
    , div [ class "vertical-space" ] []
    ]

viewForm : TapMutation -> List Brew -> List Weight -> Html Msg
viewForm edit brews weights =
    form [ class "form" ]
        [ viewField Text "Name" (Maybe.withDefault "" edit.name) (Edit Name)
        , viewSelect "Brew on tap" (Maybe.withDefault "" edit.brew) (brewOptions brews) (Edit Brew)
        , viewSelect "Keg weight" (Maybe.withDefault "" edit.weight) (weightOptions weights) (Edit Weight)
        , viewField Number "Volume (L)" (Maybe.map fromFloat edit.volume |> Maybe.withDefault "") (Edit Volume)
        , viewField Number "Order" (Maybe.map fromInt edit.order |> Maybe.withDefault "") (Edit Order)
        ]


brewOptions : List Brew -> List Option
brewOptions brews =
    List.map (\brew -> Option (BrewID.toString brew.id) ("#" ++ (fromInt brew.brewNumber) ++ " " ++ brew.name) ) brews

weightOptions : List Weight -> List Option
weightOptions weights =
    List.map .id weights
        |> List.map WeightID.toString
        |> List.map (\weight -> Option weight weight)
