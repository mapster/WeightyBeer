module Component.Form exposing (viewField, InputType(..), viewSelect, Option)


import Html exposing (Attribute, Html, div, hr, input, label, select, text)
import Html.Attributes as Attr exposing (class, for)
import Html.Events exposing (onInput)

type InputType
    = Text
    | Number

type alias Option =
    { value: String
    , label: String
    }

-- Public
viewField : InputType -> String -> String -> (String -> msg) -> Html msg
viewField inputType field value msg =
    div [ class "field" ]
        [ input [ typeAttr inputType, Attr.value value, Attr.id (fieldId field), onInput msg ] []
        , label [ for (fieldId field) ] [ text field ]
        , hr [ class "divider "] []
        , hr [ class "divider overlay" ] []
        ]

viewSelect : String -> String -> List Option -> (String -> msg) -> Html msg
viewSelect field selected options msg =
    div [ class "field" ]
        [ select [ onInput msg , Attr.id (fieldId field) ] (viewOptions selected options)
        , label [ for (fieldId field) ] [ text field ]
        , hr [ class "divider" ] []
        , hr [ class "divider overlay" ] []
        ]


-- Internal

viewOptions : String -> List Option -> List (Html msg)
viewOptions selected options =
    ([ Html.option [] [] ] ++ List.map (viewOption selected) options)

viewOption : String -> Option -> Html msg
viewOption selected option =
    Html.option [ Attr.value option.value, Attr.selected (selected == option.value) ] [ text option.label ]


fieldId : String -> String
fieldId name =
    "field-" ++ name

typeAttr : InputType -> Attribute msg
typeAttr inputType =
    case inputType of
        Text ->
            Attr.type_ "text"

        Number ->
            Attr.type_ "number"
