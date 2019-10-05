module Type.ImageID exposing (ImageID, eq, jsonDecode, selection, toString, urlParser)

import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Json.Decode
import Url.Parser
import WeightyBeer.Object
import WeightyBeer.Object.Image


type ImageID
    = ImageID String


eq : String -> ImageID -> Bool
eq str =
    (==) (ImageID str)


toString : ImageID -> String
toString (ImageID id) =
    id


urlParser : Url.Parser.Parser (ImageID -> a) a
urlParser =
    Url.Parser.custom "IMAGE_ID" (Just << ImageID)


selection : SelectionSet ImageID WeightyBeer.Object.Image
selection =
    SelectionSet.map ImageID WeightyBeer.Object.Image.id


jsonDecode : Json.Decode.Decoder ImageID
jsonDecode =
    Json.Decode.map ImageID (Json.Decode.field "id" Json.Decode.string)
