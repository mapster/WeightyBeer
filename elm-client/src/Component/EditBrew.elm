module Component.EditBrew exposing (Field, Msg(..), update, view)

import Component.Form exposing (Field, InputType(..), viewField)
import Html exposing (Html, div, form)
import Html.Attributes exposing (class)
import Type.Brew exposing (PartialBrew)
import Type.ModifiableValue as Value
import Utils


type Field
    = BrewNumber
    | Name
    | Style
    | ABV
    | IBU


type Msg
    = Edit Field String
    | Save
    | Cancel


update : PartialBrew -> Field -> String -> PartialBrew
update mutation field value =
    case field of
        BrewNumber ->
            { mutation | brewNumber = Value.update mutation.brewNumber (String.toInt value) }

        Name ->
            { mutation | name = Value.update mutation.name (Utils.emptyAsNothing value) }

        Style ->
            { mutation | style = Value.update mutation.style (Utils.emptyAsNothing value) }

        ABV ->
            { mutation | abv = Value.update mutation.abv (String.toFloat value) }

        IBU ->
            { mutation | ibu = Value.update mutation.ibu (String.toInt value) }


view : PartialBrew -> Html Msg
view partial =
    div [ class "edit-tap-card" ]
        [ div [ class "column" ]
            [ viewForm partial ]
        ]


viewForm : PartialBrew -> Html Msg
viewForm partial =
    let
        number =
            Field "Brew #" (Value.map String.fromInt partial.brewNumber) True

        name =
            Field "Name" partial.name True

        style =
            Field "Style" partial.style True

        abv =
            Field "ABV" (Value.map String.fromFloat partial.abv) True

        ibu =
            Field "IBU" (Value.map String.fromInt partial.ibu) True
    in
    form [ class "form" ]
        [ viewField number Number (Edit BrewNumber)
        , viewField name Text (Edit Name)
        , viewField style Text (Edit Style)
        , viewField abv Number (Edit ABV)
        , viewField ibu Number (Edit IBU)
        ]
