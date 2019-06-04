module Page.EditTap exposing (Model, Msg, init, subscriptions, update, view)

import Component.ErrorDetails as ErrorDetails
import Component.Form as Form exposing (InputType(..), Option, viewField, viewSelect)
import Component.TapCard as TapCard
import Graphql.Http exposing (RawError(..))
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Html exposing (Html, div, form, text)
import Html.Attributes exposing (class)
import Maybe exposing (Maybe)
import String exposing (fromFloat, fromInt)
import Type.BrewID as BrewID exposing (BrewID)
import Type.Tap exposing (Brew, Tap, Weight, brewSelection, tapSelection, weightSelection)
import Type.TapID as TapID exposing (TapID)
import Type.WeightID as WeightID exposing (WeightID)
import Utils.Maybe exposing (isJust)
import WeightyBeer.Query as Query

type Model
    = EditTap EditModel
--    | NewTap NewModel
    | Error ErrorModel
    | Loading

type alias EditModel =
    { original: Tap
    , brews: List Brew
    , weights: List Weight
    , mutation: TapMutation
    , error: Maybe String
    }

type alias NewModel =
    { brews: List Brew
    , weights: List Weight
    , mutation: TapMutation
    }

type alias ErrorModel = String

type alias Response =
    Result (Graphql.Http.Error ResponseData) ResponseData

type alias ResponseData =
    { tap: Maybe Tap
    , brews: List Brew
    , weights: List Weight
    }

type Msg
    = GotResponse Response
    | Edit Field String

type Field
    = Name
    | Volume
    | Order
    | Brew
    | Weight

type alias TapMutation =
    { name: Maybe String
    , brew: Maybe Brew
    , weight: Maybe Weight
    , volume: Maybe Float
    , order: Maybe Int
    }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none

emptyMutation : TapMutation
emptyMutation =
    TapMutation Nothing Nothing Nothing Nothing Nothing

init : TapID -> (Model, Cmd Msg)
init id =
    (Loading, requestTap id)


requestTap : TapID -> Cmd Msg
requestTap id  =
    (SelectionSet.map3 ResponseData
        (Query.tap (TapID.toArg id) tapSelection)
        (Query.brews brewSelection)
        (Query.weights weightSelection))
        |> Graphql.Http.queryRequest "http://localhost:3000/graphql"
        |> Graphql.Http.send GotResponse

fromMutation : TapID -> TapMutation -> Tap
fromMutation id mutation =
    Tap id
        (Maybe.withDefault "" mutation.name)
        (Maybe.withDefault 0 mutation.order)
        (Maybe.withDefault 0 mutation.volume)
        mutation.brew
        mutation.weight

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GotResponse response ->
            (updateFromResponse response model, Cmd.none)

        Edit field value ->
            (updateField field value model, Cmd.none)

updateFromResponse : Response -> Model -> Model
updateFromResponse response model =
    case response of

        Err error ->
            Error <| ErrorDetails.errorToString error

        Ok data ->
            case (data.tap, model) of
                (Just original, Loading) ->
                    EditTap (EditModel original data.brews data.weights emptyMutation Nothing)

                (Just original, Error _) ->
                    EditTap (EditModel original data.brews data.weights emptyMutation Nothing)

                (Just original, EditTap editModel) ->
                    EditTap { editModel | original = original, brews = data.brews, weights = data.weights}

                (Nothing, Error _) ->
                    Error "Tap doesn't exist"

                (Nothing, Loading) ->
                    Error "Tap doesn't exist"

                (Nothing, EditTap editModel) ->
                    EditTap { editModel | error = Just "Tap was deleted remotely"}

updateField : Field -> String -> Model -> Model
updateField field value model=
    case model of
        Error _ ->
            model

        Loading ->
            Error "Cannot edit while loading!"

        EditTap {original, brews, weights, mutation} ->
            let
                updatedMutation =
                    case field of
                        Name ->
                            { mutation | name = justIfChanged original.name value }

                        Volume ->
                            { mutation | volume =
                                String.toFloat value
                                    |> Maybe.withDefault original.volume
                                    |> justIfChanged original.volume
                            }

                        Order ->
                            { mutation | order =
                                String.toInt value
                                    |> Maybe.withDefault original.order
                                    |> justIfChanged original.order
                            }

                        Brew ->
                            let
                                brew = List.filter (.id >> BrewID.eq value) brews
                                    |> List.head
                            in
                            { mutation | brew = if brew == original.brew then Nothing else brew }

                        Weight ->
                            let
                                x = List.filter (.id >> WeightID.eq value) weights
                                    |> List.head
                            in
                            { mutation | weight = if original.weight == x then Nothing else x }
            in
            EditTap (EditModel original brews weights updatedMutation Nothing)

justIfChanged : a -> a -> Maybe a
justIfChanged original value =
    if original == value then Nothing else Just value

view : Model -> Html Msg
view model =
    case model of
        Loading ->
            div [] [ text "Loading..."]

        Error e ->
            div [] [ text e ]

        EditTap { original, brews, weights, mutation } ->
            div [ class "edit-tap-page-container" ]
                [ div [ class "edit-tap-card" ]
                    [ div [ class "column" ]
                        [ viewForm mutation original brews weights ]
                    , div [ class "column" ]
                        ( applyMutation original mutation
                            |> fromMutation original.id
                            |> viewTapCardColumn
                        )
                    ]
                ]


viewTapCardColumn : Tap -> List (Html Msg)
viewTapCardColumn tap =
    [ div [ class "tap-card-container"] [ TapCard.view (Just tap) ]
    , div [ class "vertical-space" ] []
    ]


viewForm : TapMutation -> Tap -> List Brew -> List Weight -> Html Msg
viewForm mutation original brews weights =
    let
        name =
            { inputType = Text
            , field = "Name"
            , default = original.name
            , value = mutation.name
            }
        brew =
            { field = "Brew on tap"
            , selected = Utils.Maybe.or mutation.brew original.brew |> Maybe.map (.id >> BrewID.toString)
            , modified =  (isJust mutation.brew) && (mutation.brew /= original.brew)
            , options = brewOptions brews
            }
        weight =
            { field = "Keg weight"
            , selected = (Utils.Maybe.or mutation.weight original.weight |> Maybe.map (.id >> WeightID.toString))
            , modified = (isJust mutation.weight) && (mutation.weight /= original.weight)
            , options = weightOptions weights
            }
        volume =
            { inputType = Number
            , field = "Volume (L)"
            , default = (fromFloat original.volume)
            , value = (Maybe.map fromFloat mutation.volume)
            }
        order =
            { inputType = Number
            , field = "Order"
            , default = (fromInt original.order)
            , value = (Maybe.map fromInt mutation.order)
            }
    in
    form [ class "form" ]
        [ viewField name (Edit Name)
        , viewSelect brew (Edit Brew)
        , viewSelect weight (Edit Weight)
        , viewField volume (Edit Volume)
        , viewField order (Edit Order)
        ]

applyMutation : Tap -> TapMutation -> TapMutation
applyMutation tap mutation =
    TapMutation
        (Just <| Maybe.withDefault tap.name mutation.name)
        (Utils.Maybe.or mutation.brew tap.brew )
        (Utils.Maybe.or mutation.weight tap.weight)
        (Just <| Maybe.withDefault tap.volume mutation.volume)
        (Just <| Maybe.withDefault tap.order mutation.order)


brewOptions : List Brew -> List Option
brewOptions brews =
    List.map (\brew -> Option (BrewID.toString brew.id) ("#" ++ (fromInt brew.brewNumber) ++ " " ++ brew.name) ) brews

weightOptions : List Weight -> List Option
weightOptions weights =
    List.map .id weights
        |> List.map WeightID.toString
        |> List.map (\weight -> Option weight weight)
