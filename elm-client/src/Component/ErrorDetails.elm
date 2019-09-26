module Component.ErrorDetails exposing (ErrorDetails, errorDetails, view)

import Constants exposing (weightyBeerHost)
import Graphql.Http
import Html exposing (Html, button, div, p, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Json.Decode
import String exposing (fromInt)
import Utils exposing (textEl)


type alias ErrorDetails =
    { message : String
    , error : Maybe (Graphql.Http.Error ())
    }


errorDetails : String -> Graphql.Http.Error () -> ErrorDetails
errorDetails message error =
    ErrorDetails message (Just error)


view : viewDetailsMsg -> Bool -> ErrorDetails -> Html viewDetailsMsg
view msg showDetails error =
    div [ class "error-details" ]
        [ button [ onClick msg ] [ text "⚠" ]
        , textEl error.message
        , viewErrorDetails showDetails error
        ]


viewErrorDetails : Bool -> ErrorDetails -> Html viewDetailsMsg
viewErrorDetails showDetails error =
    case ( showDetails, error.error ) of
        ( True, Just graphError ) ->
            let
                details =
                    case graphError of
                        Graphql.Http.GraphqlError possiblyParsedData list ->
                            Debug.todo "Show a sensible error message for GraphqlError"

                        Graphql.Http.HttpError httpError ->
                            case httpError of
                                Graphql.Http.BadUrl msg ->
                                    div []
                                        [ p [] [ text "Got badURL " ]
                                        ]

                                Graphql.Http.Timeout ->
                                    div []
                                        [ p [] [ text "Request timed out" ]
                                        ]

                                Graphql.Http.NetworkError ->
                                    div []
                                        [ p [] [ text ("Network error: Are you sure that the WeightyBeer API is running on '" ++ weightyBeerHost ++ "'?") ]
                                        ]

                                Graphql.Http.BadStatus metadata errorMsg ->
                                    case metadata.statusCode of
                                        400 ->
                                            div []
                                                [ p []
                                                    [ text """400 - Bad request: Most likely because the WeightyBeer API schema differs from the client.
                                                            Are your elm-client and API running at the same version?"""
                                                    ]
                                                , p [] [ text errorMsg ]
                                                ]

                                        404 ->
                                            div []
                                                [ p [] [ text ("404 - Not Found: Are you running WeightyBeer API at '" ++ weightyBeerHost ++ "'?") ]
                                                ]

                                        other ->
                                            div []
                                                [ p [] [ text (fromInt other ++ ": A non-recoverable error. Please report an issue" ++ errorMsg) ]
                                                ]

                                Graphql.Http.BadPayload payloadError ->
                                    div []
                                        [ p []
                                            [ text """Unable to decode graphql response: Most likely because the WeightyBeer API schema differs from the client.
                                                    Are your elm-client and API running at the same version?"""
                                            ]
                                        , p [] [ text (Json.Decode.errorToString payloadError) ]
                                        ]
            in
            div [ class "details" ] [ details ]

        _ ->
            div [] []



--errorToString : Graphql.Http.Error parsedData -> String
--errorToString errorData =
--    case errorData of
--        Graphql.Http.GraphqlError _ graphqlErrors ->
--            graphqlErrors
--                |> List.map graphqlErrorToString
--                |> String.join "\n"
--
--        Graphql.Http.HttpError httpError ->
--            case httpError of
--                Graphql.Http.BadUrl msg ->
--                    "Invalid URL to WeightyBeer API: " ++ msg
--
--                Graphql.Http.Timeout ->
--                    "Request timed out"
--
--                Graphql.Http.NetworkError ->
--                    "Network error: Failed to connect to WeightyBeer API (" ++ weightyBeerHost ++ ")"
--
--                Graphql.Http.BadStatus metadata string ->
--                    "Got bad status response" ++ fromInt metadata.statusCode
--
--                Graphql.Http.BadPayload error ->
--                    Debug.todo ""
--graphqlErrorToString : Graphql.Http.GraphqlError.GraphqlError -> String
--graphqlErrorToString error =
--    error.message
