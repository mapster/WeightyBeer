module Type.TapID exposing (TapID, toString, urlParser, selection, toArg)

import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Url.Parser
import WeightyBeer.Object
import WeightyBeer.Object.Tap
type TapID
    = TapID String

toString : TapID -> String
toString (TapID id) =
    id

urlParser : Url.Parser.Parser (TapID -> a) a
urlParser =
    Url.Parser.custom "TAP_ID" (Just << TapID)

selection : SelectionSet TapID WeightyBeer.Object.Tap
selection =
    SelectionSet.map TapID WeightyBeer.Object.Tap.id

toArg : TapID -> { id: String }
toArg id =
    {id = toString id}