module Component.Form exposing (Field, InputType(..), Option, viewField, viewSelect)

import Html exposing (Attribute, Html, div, hr, input, label, select, text)
import Html.Attributes as Attr exposing (class, for)
import Html.Events exposing (onInput)
import Utils.Maybe exposing (isJust)


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
    let
        inputAttrs =
            withModifiedClass field
                [ typeAttr inputType
                , Attr.value (reduceValue field)
                , Attr.id (fieldId field)
                , onInput msg
                ]
    in
    div [ class "field" ]
        [ input inputAttrs []
        , label [ for (fieldId field) ] [ text field.name ]
        , hr [ class "divider " ] []
        , hr [ class "divider overlay" ] []
        ]


viewSelect : Field -> List Option -> (String -> msg) -> Html msg
viewSelect field options msg =
    div [ class "field" ]
        [ select (withModifiedClass field [ onInput msg, Attr.id (fieldId field) ]) (viewOptions field options)
        , label [ for (fieldId field) ] [ text field.name ]
        , hr [ class "divider" ] []
        , hr [ class "divider overlay" ] []
        ]



-- Internal


reduceValue : Field -> String
reduceValue { original, mutation } =
    Utils.Maybe.or mutation original
        |> Maybe.withDefault ""


withModifiedClass : Field -> List (Attribute msg) -> List (Attribute msg)
withModifiedClass { original, mutation } attributes =
    if isJust mutation && mutation /= original then
        [ class "modified" ] ++ attributes

    else
        attributes


withOriginalClass : Maybe String -> Option -> List (Attribute msg) -> List (Attribute msg)
withOriginalClass originalMaybe option attributes =
    case originalMaybe of
        Just original ->
            if original == option.value then
                [ class "original" ] ++ attributes

            else
                attributes

        _ ->
            attributes


viewOptions : Field -> List Option -> List (Html msg)
viewOptions select options =
    [ Html.option [] [] ] ++ List.map (viewOption select) options


viewOption : Field -> Option -> Html msg
viewOption select option =
    Html.option
        (withOriginalClass select.original
            option
            [ Attr.value option.value, Attr.selected (isSelected select option) ]
        )
        [ text option.label ]


isSelected : Field -> Option -> Bool
isSelected field option =
    reduceValue field == option.value


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
