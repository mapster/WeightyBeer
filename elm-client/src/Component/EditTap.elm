module Component.EditTap exposing (Field(..), Msg(..), view)

import Component.Form exposing (Field, InputType(..), Option, viewButtons, viewField, viewSelect)
import Component.TapCard as TapCard
import Html exposing (Html, div, form)
import Html.Attributes exposing (class)
import Maybe.Extra
import String exposing (fromFloat, fromInt)
import Type.BrewID as BrewID
import Type.ModifiableValue as Value
import Type.Tap exposing (Brew, PartialTap, Tap, TapMutation, Weight)
import Type.WeightID as WeightID


type Field
    = Name
    | Volume
    | Order
    | Brew
    | Weight

type Msg
    = Edit Field String
    | Save
    | Cancel

view : List Brew -> List Weight -> PartialTap -> Html Msg
view brews weights partial =
    div [ class "edit-tap-card" ]
        [ div [ class "column" ]
            [ viewForm brews weights partial ]
        , div [ class "column" ]
            (viewTapCardColumn partial)
        ]

viewTapCardColumn : PartialTap -> List (Html msg)
viewTapCardColumn tap =
    [ div [ class "tap-card-container" ] [ TapCard.view tap ]
    , div [ class "vertical-space" ] []
    ]


viewForm : List Brew -> List Weight -> PartialTap -> Html Msg
viewForm brews weights partial =
    let
        name =
            Field "Name" partial.name

        brew =
            Field "Brew on tap" (Value.map (.id >> BrewID.toString) partial.brew)

        weight =
            Field "Keg weight" (Value.map (.id >> WeightID.toString) partial.weight)

        volume =
            Field "Volume (L)" (Value.map fromFloat partial.volume)

        order =
            Field "Order" (Value.map fromInt partial.order)
    in
    form [ class "form" ]
        [ viewField name Text (Edit Name)
        , viewSelect brew (brewOptions brews) (Edit Brew)
        , viewSelect weight (weightOptions weights) (Edit Weight)
        , viewField volume Number (Edit Volume)
        , viewField order Number (Edit Order)
        , viewButtons Save Cancel (isModified partial)
        ]


isModified : PartialTap -> Bool
isModified partial =
    Value.isModified partial.name ||
    Value.isModified partial.order ||
    Value.isModified partial.volume ||
    Value.isModified partial.brew ||
    Value.isModified partial.weight

brewOptions : List Brew -> List Option
brewOptions brews =
    List.map (\brew -> Option (BrewID.toString brew.id) ("#" ++ fromInt brew.brewNumber ++ " " ++ brew.name)) brews


weightOptions : List Weight -> List Option
weightOptions weights =
    List.map .id weights
        |> List.map WeightID.toString
        |> List.map (\weight -> Option weight weight)
