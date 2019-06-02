module Type.BrewID exposing (BrewID, toString, urlParser, selection)

import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Url.Parser
import WeightyBeer.Object
import WeightyBeer.Object.Brew

type BrewID
    = BrewID String

toString : BrewID -> String
toString (BrewID id) =
    id

urlParser : Url.Parser.Parser (BrewID -> a) a
urlParser =
    Url.Parser.custom "BREW_ID" (Just << BrewID)

selection : SelectionSet BrewID WeightyBeer.Object.Brew
selection =
    SelectionSet.map BrewID WeightyBeer.Object.Brew.id