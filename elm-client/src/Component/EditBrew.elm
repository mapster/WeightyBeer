module Component.EditBrew exposing (Field(..), Msg(..), update, uploadImage, view)

import Component.ChooseImage
import Component.Form exposing (Field, InputType(..), viewButtons, viewField)
import Constants exposing (weightyBeerImageUpload)
import File exposing (File)
import Html exposing (Html, div, form)
import Html.Attributes exposing (class)
import Http
import Maybe.Extra exposing (isJust)
import Type.Brew exposing (Image, PartialBrew, imageDecoder, isModified, toNewBrew)
import Type.ImageID as ImageID exposing (ImageID)
import Type.ModifiableValue as Value
import Utils


type Field
    = BrewNumber
    | Name
    | Style
    | ABV
    | IBU
    | Image


type Msg
    = Edit Field String
    | Save
    | Cancel
    | ToggleGallery
    | RequestImageUpload
    | DeleteImage ImageID


update : List Image -> PartialBrew -> Field -> String -> PartialBrew
update images mutation field value =
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

        Image ->
            { mutation
                | image =
                    List.filter (.id >> ImageID.eq value) images
                        |> List.head
                        |> Value.update mutation.image
            }


view : List Image -> PartialBrew -> Bool -> Html Msg
view images partial showGallery =
    div [ class "two-column-card" ]
        [ div [ class "column" ]
            [ viewForm partial ]
        , div [ class "column" ]
            [ viewImage images (Value.toMaybe partial.image) showGallery ]
        ]


viewImage : List Image -> Maybe Image -> Bool -> Html Msg
viewImage images current showGallery =
    Component.ChooseImage.view images current showGallery
        |> Html.map mapChooseImageMsg


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
        , viewButtons Save Cancel (Utils.and isModified (toNewBrew >> isJust) partial)
        ]


mapChooseImageMsg : Component.ChooseImage.Msg -> Msg
mapChooseImageMsg msg =
    case msg of
        Component.ChooseImage.ToggleGallery ->
            ToggleGallery

        Component.ChooseImage.SelectImage image ->
            Edit Image (ImageID.toString image.id)

        Component.ChooseImage.DeselectImage ->
            Edit Image ""

        Component.ChooseImage.RequestImageUpload ->
            RequestImageUpload

        Component.ChooseImage.DeleteImage id ->
            DeleteImage id


uploadImage : (Result Http.Error Image -> msg) -> File -> Cmd msg
uploadImage msg file =
    Http.post
        { url = weightyBeerImageUpload
        , body = Http.multipartBody [ Http.filePart "brewImage" file ]
        , expect = Http.expectJson msg imageDecoder
        }
