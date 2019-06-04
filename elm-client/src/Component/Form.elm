module Component.Form exposing (viewField, InputType(..), viewSelect, Option, Select, Field)


import Html exposing (Attribute, Html, div, hr, input, label, select, text)
import Html.Attributes as Attr exposing (class, for)
import Html.Events exposing (onInput)
import Utils.Maybe exposing (isJust)

type InputType
    = Text
    | Number

type alias Option =
    { value: String
    , label: String
    }

type alias Field =
    { inputType: InputType
    , field: String
    , default: String
    , value: Maybe String
    }

type alias Select =
    { field: String
    , selected: Maybe String
    , modified: Bool
    , options: List Option
    }

-- Public
viewField : Field -> (String -> msg) -> Html msg
viewField { inputType, field, default, value} msg =
    let
        inputAttrs =
            [ typeAttr inputType, Attr.value <| Maybe.withDefault default value, Attr.id (fieldId field), onInput msg ]
            ++ ( modifiedClass value )
    in
    div [ class "field" ]
        [ input inputAttrs []
        , label [ for (fieldId field) ] [ text field ]
        , hr [ class "divider "] []
        , hr [ class "divider overlay" ] []
        ]

viewSelect : Select -> (String -> msg) -> Html msg
viewSelect {field, selected, modified, options} msg =
    let
        selectAttrs =
            [ onInput msg , Attr.id (fieldId field) ] ++
            if modified
                then
                    [ class "modified"]
                else
                    []
    in
    div [ class "field" ]
        [ select selectAttrs  (viewOptions selected options)
        , label [ for (fieldId field) ] [ text field ]
        , hr [ class "divider" ] []
        , hr [ class "divider overlay" ] []
        ]


-- Internal
modifiedClass value =
    if isJust value
        then
            [ class "modified" ]
        else
            []

viewOptions : Maybe String -> List Option -> List (Html msg)
viewOptions selected options =
    ([ Html.option [] [] ] ++ List.map (viewOption selected) options)

viewOption : Maybe String -> Option -> Html msg
viewOption selected option =
    let
        isSelected =
            Maybe.map ((==) option.value) selected
                |> Maybe.withDefault False
    in
    Html.option [ Attr.value option.value, Attr.selected isSelected ] [ text option.label ]


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
