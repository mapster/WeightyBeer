-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module WeightyBeer.Object.TapMutation exposing (..)

import Graphql.Internal.Builder.Argument as Argument exposing (Argument)
import Graphql.Internal.Builder.Object as Object
import Graphql.Internal.Encode as Encode exposing (Value)
import Graphql.Operation exposing (RootMutation, RootQuery, RootSubscription)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet exposing (SelectionSet)
import Json.Decode as Decode
import WeightyBeer.InputObject
import WeightyBeer.Interface
import WeightyBeer.Object
import WeightyBeer.Scalar
import WeightyBeer.ScalarCodecs
import WeightyBeer.Union


type alias CreateOptionalArguments =
    { weight : OptionalArgument String
    , brew : OptionalArgument String
    }


type alias CreateRequiredArguments =
    { name : String
    , order : Int
    , volume : Float
    , isActive : Bool
    }


create : (CreateOptionalArguments -> CreateOptionalArguments) -> CreateRequiredArguments -> SelectionSet decodesTo WeightyBeer.Object.Tap -> SelectionSet decodesTo WeightyBeer.Object.TapMutation
create fillInOptionals requiredArgs object_ =
    let
        filledInOptionals =
            fillInOptionals { weight = Absent, brew = Absent }

        optionalArgs =
            [ Argument.optional "weight" filledInOptionals.weight Encode.string, Argument.optional "brew" filledInOptionals.brew Encode.string ]
                |> List.filterMap identity
    in
    Object.selectionForCompositeField "create" (optionalArgs ++ [ Argument.required "name" requiredArgs.name Encode.string, Argument.required "order" requiredArgs.order Encode.int, Argument.required "volume" requiredArgs.volume Encode.float, Argument.required "isActive" requiredArgs.isActive Encode.bool ]) object_ identity


type alias UpdateOptionalArguments =
    { weight : OptionalArgument String
    , brew : OptionalArgument String
    }


type alias UpdateRequiredArguments =
    { id : String
    , name : String
    , order : Int
    , volume : Float
    , isActive : Bool
    }


update : (UpdateOptionalArguments -> UpdateOptionalArguments) -> UpdateRequiredArguments -> SelectionSet decodesTo WeightyBeer.Object.Tap -> SelectionSet (Maybe decodesTo) WeightyBeer.Object.TapMutation
update fillInOptionals requiredArgs object_ =
    let
        filledInOptionals =
            fillInOptionals { weight = Absent, brew = Absent }

        optionalArgs =
            [ Argument.optional "weight" filledInOptionals.weight Encode.string, Argument.optional "brew" filledInOptionals.brew Encode.string ]
                |> List.filterMap identity
    in
    Object.selectionForCompositeField "update" (optionalArgs ++ [ Argument.required "id" requiredArgs.id Encode.string, Argument.required "name" requiredArgs.name Encode.string, Argument.required "order" requiredArgs.order Encode.int, Argument.required "volume" requiredArgs.volume Encode.float, Argument.required "isActive" requiredArgs.isActive Encode.bool ]) object_ (identity >> Decode.nullable)


type alias RemoveRequiredArguments =
    { id : String }


remove : RemoveRequiredArguments -> SelectionSet decodesTo WeightyBeer.Object.Tap -> SelectionSet (Maybe decodesTo) WeightyBeer.Object.TapMutation
remove requiredArgs object_ =
    Object.selectionForCompositeField "remove" [ Argument.required "id" requiredArgs.id Encode.string ] object_ (identity >> Decode.nullable)
