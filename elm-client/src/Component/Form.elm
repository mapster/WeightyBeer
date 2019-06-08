module Component.Form exposing (Field, InputType(..), Option, viewButtons, viewField, viewSelect)

import Html exposing (Attribute, Html, button, div, hr, input, label, select, text)
import Html.Attributes as Attr exposing (class, classList, for, type_)
import Html.Events exposing (onClick, onInput)
import Maybe.Extra


type InputType
    = Text
    | Number


type alias Field =
    { name : String
    , mutation : Maybe String
    , original : Maybe String
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
            , Attr.value (reduceValue field)
            , Attr.id (fieldId field)
            , onInput msg
            , classList [ ( "modified", isModified field ) ]
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
            , Attr.id (fieldId field)
            , classList [ ( "modified", isModified field ) ]
            ]
            (viewOptions field options)
        , label [ for (fieldId field) ] [ text field.name ]
        , hr [ class "divider" ] []
        , hr [ class "divider overlay" ] []
        ]


viewButtons : msg -> msg -> Html msg
viewButtons save cancel =
    div [ class "buttons" ]
        [ button [ class "save", type_ "button", onClick save ] [ text "Save" ]
        , button [ class "cancel", type_ "button", onClick cancel ] [ text "Cancel" ]
        ]



-- Internal


viewOptions : Field -> List Option -> List (Html msg)
viewOptions select options =
    [ Html.option [] [ text "<nothing>" ] ] ++ List.map (viewOption select) options


viewOption : Field -> Option -> Html msg
viewOption field option =
    Html.option
        [ Attr.value option.value
        , Attr.selected (isSelected field option)
        , classList [ ( "original", isOriginal field option ) ]
        ]
        [ text option.label ]


isSelected : Field -> Option -> Bool
isSelected field option =
    reduceValue field == option.value


isModified : Field -> Bool
isModified { original, mutation } =
    Maybe.Extra.isJust mutation && mutation /= original


isOriginal : Field -> Option -> Bool
isOriginal { original } option =
    Maybe.map ((==) option.value) original
        |> Maybe.withDefault False


reduceValue : Field -> String
reduceValue { original, mutation } =
    Maybe.Extra.or mutation original
        |> Maybe.withDefault ""


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
