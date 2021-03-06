module Utils exposing (and, emptyAsNothing, fillInOptional, textClass, textEl, updateInList)

import Graphql.OptionalArgument as OptionalArgument exposing (OptionalArgument)
import Html exposing (Html, span, text)
import Html.Attributes exposing (class)


textEl : String -> Html msg
textEl string =
    textClass [] string


textClass : List String -> String -> Html msg
textClass classes string =
    span (List.map class classes) [ text string ]


and : (a -> Bool) -> (a -> Bool) -> a -> Bool
and p1 p2 arg =
    p1 arg && p2 arg


emptyAsNothing : String -> Maybe String
emptyAsNothing str =
    case String.isEmpty str of
        True ->
            Nothing

        False ->
            Just str


fillInOptional : Maybe a -> (a -> b) -> OptionalArgument b
fillInOptional arg getter =
    (OptionalArgument.fromMaybe >> OptionalArgument.map getter) arg


updateInList : { item | id : id } -> List { item | id : id } -> List { item | id : id }
updateInList item list =
    let
        updated =
            List.map (replaceById item) list
    in
    if List.member item updated then
        updated

    else
        item :: list


replaceById : { a | id : id } -> { a | id : id } -> { a | id : id }
replaceById new orig =
    if new.id == orig.id then
        new

    else
        orig
