module Type.ModifiableValue exposing (Value(..), map, toString, isModified, toMaybe, from, fromOptional)

type Value a
    = Modified a
    | Original a
--    | Unmodified
    | NoValue

--toString : (a -> String) -> Value a -> String
--toString mapper =
--    (map mapper) >> (Maybe.withDefault "")

fromOptional : Maybe a -> Maybe a -> Value a
fromOptional original new =
    case original of
        Just value ->
            from value new
        Nothing ->
            Maybe.map Modified new
                |> Maybe.withDefault NoValue

from : a -> Maybe a -> Value a
from original new =
    case new of
        Just value ->
            case value == original of
                True ->
                    Original value
                False ->
                    Modified value
        Nothing ->
            NoValue

toString: Value String -> String
toString =
    toMaybe >> Maybe.withDefault ""

map : (a -> b) -> Value a -> Value b
map mapper value =
    case value of
        Original v ->
            (mapper >> Original) v
        Modified v ->
            (mapper >> Modified) v
--        Unmodified ->
--            Unmodified
        NoValue ->
            NoValue

toMaybe : Value a -> Maybe a
toMaybe value =
    case value of
        Modified v ->
            Just v
        Original v ->
            Just v
        _ ->
            Nothing

isModified : Value a -> Bool
isModified value =
    case value of
        Original _ ->
            False
        _ ->
            True
