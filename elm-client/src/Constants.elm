module Constants exposing (weightyBeerGraphql, weightyBeerHost, weightyBeerImageUpload)


weightyBeerHost =
    "http://localhost:3000"


weightyBeerGraphql =
    weightyBeerHost ++ "/graphql"


weightyBeerImageUpload =
    weightyBeerHost ++ "/upload/image"
