module Utils.Maybe exposing (..)

or : Maybe a -> Maybe a -> Maybe a
or a b =
    case a of
        Just _ -> a
        Nothing -> b

isJust : Maybe a -> Bool
isJust maybe =
    case maybe of
        Just _ -> True
        Nothing -> False