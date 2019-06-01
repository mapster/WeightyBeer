module Component.Table exposing (viewTable)

import Html exposing (Html, div, hr, span)
import Html.Attributes exposing (class)
import Utils exposing (textClass)


viewTable : List ( String, a -> Html msg ) -> List a -> Html msg
viewTable columns rows =
    div [ class "table" ] (List.map (viewColumn rows) columns)


viewColumn : List a -> ( String, a -> Html msg ) -> Html msg
viewColumn rows ( header, cellContent ) =
    div [ class "column" ]
        (viewHeader header ++ viewRows cellContent rows ++ [ viewDivider ])


viewHeader : String -> List (Html msg)
viewHeader content =
    [ viewCell (textClass [ "header" ] content)
    , viewDivider
    ]


viewRows : (a -> Html msg) -> List a -> List (Html msg)
viewRows cellContent rows =
    List.map (cellContent >> viewCell) rows
        |> List.intersperse viewDivider


viewCell : Html msg -> Html msg
viewCell content =
    div [ class "cell" ] [ span [] [ content ] ]


viewDivider : Html msg
viewDivider =
    hr [ class "divider" ] []
