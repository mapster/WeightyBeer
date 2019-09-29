module Component.Form exposing (Field, InputType(..), Option, viewButtons, viewField, viewSelect)

import Html exposing (Attribute, Html, button, div, hr, input, label, select, text)
import Html.Attributes as Attr exposing (class, classList, disabled, for, type_)
import Html.Events exposing (onClick, onInput)
import Type.ModifiableValue as Value exposing (Value)

type InputType
    = Text
    | Number

type alias Field =
    { name : String
    , value : Value String
    }

type alias Option =
    { value : String
    , label : String
    }


-- Public
viewField : Field -> InputType -> (String -> msg) -> Html msg
viewField field inputType msg =
    div [ class "field" ]
        [ input
            [ typeAttr inputType
            , (Value.toString >> Attr.value) field.value
            , (fieldId >> Attr.id) field
            , onInput msg
            , classList [ ( "modified", Value.isModified field.value ) ]
            ]
            []
        , label [ for (fieldId field) ] [ text field.name ]
        , hr [ class "divider " ] []
        , hr [ class "divider overlay" ] []
        ]


viewSelect : Field -> List Option -> (String -> msg) -> Html msg
viewSelect field options msg =
    div [ class "field" ]
        [ select
            [ onInput msg
            , (fieldId >> Attr.id) field
            , classList [ ( "modified", Value.isModified field.value ) ]
            ]
            (viewOptions field options)
        , label [ for (fieldId field) ] [ text field.name ]
        , hr [ class "divider" ] []
        , hr [ class "divider overlay" ] []
        ]


viewButtons : msg -> msg -> Bool -> Html msg
viewButtons save cancel modified =
    div [ class "buttons" ]
        [ button
            [ class "save"
            , type_ "button"
            , onClick save
            , disabled (not modified)
            , classList [ ( "disabled", not modified ) ]
            ]
            [ text "Save" ]
        , button
            [ class "cancel"
            , type_ "button"
            , onClick cancel
            ]
            [ text "Cancel" ]
        ]



-- Internal


viewOptions : Field -> List Option -> List (Html msg)
viewOptions select options =
    List.map (viewOption select) ([ Option "" "<nothing>" ] ++ options)


viewOption : Field -> Option -> Html msg
viewOption field option =
    Html.option
        [ Attr.value option.value
        , Attr.selected (isSelected field option)
--        , classList [ ( "original", Value.isOriginal field.value ) ]
        ]
        [ text option.label ]


isSelected : Field -> Option -> Bool
isSelected field option =
    Value.toString field.value == option.value


--isModified : Field -> Bool
--isModified { original, mutation } =
--    Maybe.Extra.isJust mutation && mutation /= original


--isOriginal : Field -> Option -> Bool
--isOriginal { original } option =
--    case original of
--        Nothing ->
--            String.isEmpty option.value
--
--        Just value ->
--            option.value == value


--reduceValue : Field -> String
--reduceValue { original, mutation } =
--    Maybe.Extra.or mutation original
--        |> Maybe.withDefault ""


fieldId : Field -> String
fieldId { name } =
    "field-" ++ name


typeAttr : InputType -> Attribute msg
typeAttr inputType =
    case inputType of
        Text ->
            Attr.type_ "text"

        Number ->
            Attr.type_ "number"
