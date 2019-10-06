module Type.WeightID exposing (WeightID, eq, selection, stringSelection, toString, urlParser)

import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Url.Parser
import WeightyBeer.Object
import WeightyBeer.Object.Weight


type WeightID
    = WeightID String


eq : String -> WeightID -> Bool
eq str =
    (==) (WeightID str)


toString : WeightID -> String
toString (WeightID id) =
    id


urlParser : Url.Parser.Parser (WeightID -> a) a
urlParser =
    Url.Parser.custom "Weight_ID" (Just << WeightID)


selection : SelectionSet WeightID WeightyBeer.Object.Weight
selection =
    SelectionSet.map WeightID WeightyBeer.Object.Weight.id


stringSelection : SelectionSet String WeightyBeer.Object.WeightMutation -> SelectionSet WeightID WeightyBeer.Object.WeightMutation
stringSelection =
    SelectionSet.map WeightID
