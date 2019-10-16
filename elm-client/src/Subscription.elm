port module Subscription exposing (SubscriptionID(..), cancel, create, receive)

import Component.ErrorDetails as ErrorDetails exposing (ErrorDetails)
import Graphql.Document
import Graphql.Operation exposing (RootSubscription)
import Graphql.SelectionSet exposing (SelectionSet)
import Json.Decode as Decode
import Json.Encode as Encode


type SubscriptionID
    = WeightHub
    | Home


idToString : SubscriptionID -> String
idToString id =
    case id of
        WeightHub ->
            "WeightHub"

        Home ->
            "Home"


create : SubscriptionID -> SelectionSet a RootSubscription -> Cmd msg
create id selection =
    Graphql.Document.serializeSubscription selection
        |> subscriptionWithId id
        |> createSubscription


subscriptionWithId : SubscriptionID -> String -> Encode.Value
subscriptionWithId id subscription =
    Encode.object
        [ ( "id", Encode.string <| idToString id )
        , ( "subscription", Encode.string subscription )
        ]


port createSubscription : Encode.Value -> Cmd msg



-- TODO: Must filter by SubscriptionID


receive : SelectionSet a RootSubscription -> (Result ErrorDetails a -> msg) -> Sub msg
receive selection msg =
    receiveSubscriptionData
        (Decode.decodeValue (selection |> Graphql.Document.decoder) >> Result.mapError ErrorDetails.fromJsonDecode >> msg)



--decodeSubscription : Decode.Decoder (S)


port receiveSubscriptionData : (Decode.Value -> msg) -> Sub msg


cancel : SubscriptionID -> Cmd msg
cancel =
    idToString >> cancelSubscription


port cancelSubscription : String -> Cmd msg
