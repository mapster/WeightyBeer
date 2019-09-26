module Component.EditTap exposing (Field(..), Msg(..), TapMutation, applyMutation, emptyMutation, view)

import Component.Form exposing (Field, InputType(..), Option, viewButtons, viewField, viewSelect)
import Component.TapCard as TapCard
import Html exposing (Html, div, form)
import Html.Attributes exposing (class)
import Maybe.Extra
import String exposing (fromFloat, fromInt)
import Type.BrewID as BrewID
import Type.Tap exposing (Brew, Tap, Weight)
import Type.WeightID as WeightID


type Field
    = Name
    | Volume
    | Order
    | Brew
    | Weight


type alias TapMutation =
    { name : Maybe String
    , brew : Maybe (Maybe Brew)
    , weight : Maybe (Maybe Weight)
    , volume : Maybe Float
    , order : Maybe Int
    }


type Msg
    = Edit Field String
    | Save
    | Cancel


emptyMutation : TapMutation
emptyMutation =
    TapMutation Nothing Nothing Nothing Nothing Nothing


applyMutation : Tap -> TapMutation -> Tap
applyMutation tap mutation =
    Tap
        tap.id
        (Maybe.withDefault tap.name mutation.name)
        (Maybe.withDefault tap.order mutation.order)
        (Maybe.withDefault tap.volume mutation.volume)
        (Maybe.withDefault tap.brew mutation.brew)
        (Maybe.withDefault tap.weight mutation.weight)


view : Tap -> List Brew -> List Weight -> TapMutation -> Html Msg
view original brews weights mutation =
    div [ class "edit-tap-card" ]
        [ div [ class "column" ]
            [ viewForm mutation original brews weights ]
        , div [ class "column" ]
            (applyMutation original mutation
                |> viewTapCardColumn
            )
        ]


viewTapCardColumn : Tap -> List (Html msg)
viewTapCardColumn tap =
    [ div [ class "tap-card-container" ] [ TapCard.view (Just tap) ]
    , div [ class "vertical-space" ] []
    ]


viewForm : TapMutation -> Tap -> List Brew -> List Weight -> Html Msg
viewForm mutation original brews weights =
    let
        name =
            Field "Name" mutation.name (Just original.name)

        brew =
            Field "Brew on tap"
                (unwrap (.id >> BrewID.toString) mutation.brew)
                (Maybe.map (.id >> BrewID.toString) original.brew)

        weight =
            Field "Keg weight"
                (unwrap (.id >> WeightID.toString) mutation.weight)
                (Maybe.map (.id >> WeightID.toString) original.weight)

        volume =
            Field "Volume (L)" (Maybe.map fromFloat mutation.volume) (Just (fromFloat original.volume))

        order =
            Field "Order" (Maybe.map fromInt mutation.order) (Just (fromInt original.order))
    in
    form [ class "form" ]
        [ viewField name Text (Edit Name)
        , viewSelect brew (brewOptions brews) (Edit Brew)
        , viewSelect weight (weightOptions weights) (Edit Weight)
        , viewField volume Number (Edit Volume)
        , viewField order Number (Edit Order)
        , viewButtons Save Cancel (isModified original mutation)
        ]


isModified : Tap -> TapMutation -> Bool
isModified tap mutation =
    applyMutation tap mutation /= tap


unwrap : (a -> String) -> Maybe (Maybe a) -> Maybe String
unwrap toString mutation =
    Maybe.map (Maybe.Extra.unwrap "" toString) mutation


brewOptions : List Brew -> List Option
brewOptions brews =
    List.map (\brew -> Option (BrewID.toString brew.id) ("#" ++ fromInt brew.brewNumber ++ " " ++ brew.name)) brews


weightOptions : List Weight -> List Option
weightOptions weights =
    List.map .id weights
        |> List.map WeightID.toString
        |> List.map (\weight -> Option weight weight)
