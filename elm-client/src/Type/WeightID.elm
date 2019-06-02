module Type.WeightID exposing (WeightID, toString, urlParser, selection)

import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Url.Parser
import WeightyBeer.Object
import WeightyBeer.Object.Weight

type WeightID
    = WeightID String

toString : WeightID -> String
toString (WeightID id) =
    id

urlParser : Url.Parser.Parser (WeightID -> a) a
urlParser =
    Url.Parser.custom "Weight_ID" (Just << WeightID)

selection : SelectionSet WeightID WeightyBeer.Object.Weight
selection =
    SelectionSet.map WeightID WeightyBeer.Object.Weight.id