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


receive : SubscriptionID -> SelectionSet a RootSubscription -> (Result ErrorDetails (Maybe a) -> msg) -> Sub msg
receive id selection msg =
    Decode.decodeValue (subscriptionDecoder id selection)
        >> Result.mapError ErrorDetails.fromJsonDecode
        >> msg
        |> receiveSubscriptionData


subscriptionDecoder : SubscriptionID -> SelectionSet a RootSubscription -> Decode.Decoder (Maybe a)
subscriptionDecoder id selection =
    Decode.field "id" Decode.string
        |> Decode.andThen (verifyId id selection)


verifyId : SubscriptionID -> SelectionSet a RootSubscription -> String -> Decode.Decoder (Maybe a)
verifyId id selection receivedId =
    if idToString id == receivedId then
        Graphql.Document.decoder selection
            |> Decode.field "subscription"
            |> Decode.map Just

    else
        Decode.succeed Nothing


port receiveSubscriptionData : (Decode.Value -> msg) -> Sub msg


cancel : SubscriptionID -> Cmd msg
cancel =
    idToString >> cancelSubscription


port cancelSubscription : String -> Cmd msg
