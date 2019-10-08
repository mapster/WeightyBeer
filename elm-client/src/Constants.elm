module Constants exposing (weightyBeerGraphql, weightyBeerHost, weightyBeerImageUpload)


weightyBeerHost =
    "/api"


weightyBeerGraphql =
    weightyBeerHost ++ "/graphql"


weightyBeerImageUpload =
    weightyBeerHost ++ "/upload/image"
