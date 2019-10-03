module Type.ModifiableValue exposing (Value(..), isModified, isOriginal, map, toMaybe, toString, update, updateOriginal)


type Value a
    = Modified a a
    | NewValue a
    | Unset a
    | Original a
    | NoValue


update : Value a -> Maybe a -> Value a
update old new =
    case new of
        Just newValue ->
            case old of
                Modified originalValue _ ->
                    withOriginal originalValue newValue

                NewValue _ ->
                    NewValue newValue

                Unset originalValue ->
                    withOriginal originalValue newValue

                Original originalValue ->
                    withOriginal originalValue newValue

                NoValue ->
                    NewValue newValue

        Nothing ->
            case old of
                Modified original _ ->
                    Unset original

                NewValue _ ->
                    NoValue

                Unset original ->
                    Unset original

                Original original ->
                    Unset original

                NoValue ->
                    NoValue


updateOriginal : Value a -> Maybe a -> Value a
updateOriginal value original =
    case original of
        Just origValue ->
            case value of
                Modified _ modification ->
                    Modified origValue modification

                NewValue modification ->
                    Modified origValue modification

                Unset _ ->
                    Unset origValue

                Original _ ->
                    Original origValue

                NoValue ->
                    Original origValue

        Nothing ->
            case value of
                Modified _ modification ->
                    NewValue modification

                NewValue modification ->
                    NewValue modification

                Unset _ ->
                    NoValue

                Original _ ->
                    NoValue

                NoValue ->
                    NoValue


withOriginal : a -> a -> Value a
withOriginal original modification =
    if original == modification then
        Original original

    else
        Modified original modification


toString : Value String -> String
toString =
    toMaybe >> Maybe.withDefault ""


map : (a -> b) -> Value a -> Value b
map mapper on =
    case on of
        Modified original value ->
            Modified (mapper original) (mapper value)

        NewValue value ->
            (mapper >> NewValue) value

        Unset original ->
            (mapper >> Unset) original

        Original value ->
            (mapper >> Original) value

        NoValue ->
            NoValue



-- Returns the modified value, or falls back to original


toMaybe : Value a -> Maybe a
toMaybe value =
    case value of
        Modified _ v ->
            Just v

        NewValue v ->
            Just v

        Unset _ ->
            Nothing

        Original v ->
            Just v

        NoValue ->
            Nothing


isModified : Value a -> Bool
isModified value =
    case value of
        Original _ ->
            False

        NoValue ->
            False

        _ ->
            True


isOriginal : Value a -> Maybe a -> Bool
isOriginal modifiable maybeValue =
    case ( modifiable, maybeValue ) of
        ( Modified orig _, Just value ) ->
            orig == value

        ( NewValue _, Nothing ) ->
            True

        ( Unset orig, Just value ) ->
            True

        ( Original orig, Just value ) ->
            orig == value

        ( NoValue, Nothing ) ->
            True

        _ ->
            False
