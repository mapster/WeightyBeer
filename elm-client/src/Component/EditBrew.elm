module Component.EditBrew exposing (InternalMsg, Model, Msg(..), init, update, updateMutation, uploadImage, view)

import Component.ChooseImage
import Component.ErrorDetails exposing (ErrorDetails, errorDetails)
import Component.Form exposing (Field, InputType(..), viewButtons, viewField)
import Constants exposing (weightyBeerGraphql, weightyBeerImageUpload)
import File exposing (File)
import File.Select as Select
import Graphql.Http
import Html exposing (Html, div, form)
import Html.Attributes exposing (class)
import Http
import Maybe.Extra exposing (isJust)
import Type.Brew exposing (Image, PartialBrew, imageDecoder, imageSelection, isModified, makeDeleteImageRequest, toNewBrew)
import Type.ImageID as ImageID exposing (ImageID)
import Type.ModifiableValue as Value
import Utils
import WeightyBeer.Query as Query


type Field
    = BrewNumber
    | Name
    | Style
    | ABV
    | IBU
    | Image


type Msg
    = Save
    | Cancel
    | Internal InternalMsg


type InternalMsg
    = Edit Field String
    | ToggleGallery
    | RequestImageUpload
    | UploadImage File
    | GotUploadedImageId (Result Http.Error Image)
    | DeleteImage ImageID
    | GotDeletedImageResponse (Result (Graphql.Http.Error ()) (Maybe Image))
    | GotImagesResponse ImagesResponse


type alias Model =
    { images : List Image
    , mutation : PartialBrew
    , showGallery : Bool
    , error : Maybe ErrorDetails
    }


type alias ImagesResponse =
    Result (Graphql.Http.Error ()) (List Image)


requestImages : Cmd InternalMsg
requestImages =
    Query.images imageSelection
        |> Graphql.Http.queryRequest weightyBeerGraphql
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> GotImagesResponse)


init : PartialBrew -> ( Model, Cmd InternalMsg )
init partial =
    ( Model [] partial False Nothing, requestImages )


updateMutation : Model -> PartialBrew -> Model
updateMutation model partial =
    { model | mutation = partial }


update : InternalMsg -> Model -> ( Model, Cmd InternalMsg )
update msg model =
    case msg of
        Edit field value ->
            ( { model | mutation = updateMutationField model.images model.mutation field value }, Cmd.none )

        ToggleGallery ->
            ( { model | showGallery = not model.showGallery }, Cmd.none )

        RequestImageUpload ->
            ( model, Select.file [ "image/jpeg", "image/png" ] UploadImage )

        UploadImage file ->
            ( model, uploadImage file )

        GotUploadedImageId result ->
            updateFromUploadedImage model result

        DeleteImage imageID ->
            ( model, makeDeleteImageRequest imageID GotDeletedImageResponse )

        GotDeletedImageResponse response ->
            updateFromDeleteImage model response

        GotImagesResponse imagesResponse ->
            ( updateImages model imagesResponse, Cmd.none )


updateFromDeleteImage : Model -> Result (Graphql.Http.Error ()) (Maybe Image) -> ( Model, Cmd InternalMsg )
updateFromDeleteImage model response =
    case response of
        Ok result ->
            case result of
                Just _ ->
                    ( model, requestImages )

                Nothing ->
                    ( { model | error = Just (ErrorDetails "Could not delete non-existing image" Nothing) }, Cmd.none )

        Err error ->
            ( { model | error = Just (errorDetails "Failed to delete image." error) }, Cmd.none )


updateFromUploadedImage : Model -> Result Http.Error Image -> ( Model, Cmd InternalMsg )
updateFromUploadedImage model result =
    case result of
        Ok image ->
            let
                images =
                    image :: model.images

                mutation =
                    updateMutationField images model.mutation Image (ImageID.toString image.id)
            in
            ( { model | mutation = mutation, images = images }, requestImages )

        Err _ ->
            ( { model | error = Just (ErrorDetails "Failed to upload image." Nothing) }, Cmd.none )


updateImages : Model -> ImagesResponse -> Model
updateImages model response =
    case response of
        Ok images ->
            { model | images = images }

        Err error ->
            { model | error = Just <| errorDetails "Failed to fetch brew images" error }


updateMutationField : List Image -> PartialBrew -> Field -> String -> PartialBrew
updateMutationField images mutation field value =
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


view : Model -> Html Msg
view { images, mutation, showGallery } =
    div [ class "two-column-card" ]
        [ div [ class "column" ]
            [ viewForm mutation ]
        , div [ class "column" ]
            [ viewImage images (Value.toMaybe mutation.image) showGallery ]
        ]


viewImage : List Image -> Maybe Image -> Bool -> Html Msg
viewImage images current showGallery =
    Component.ChooseImage.view images current showGallery
        |> Html.map mapChooseImageMsg
        |> Html.map Internal


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
        [ viewField number Number (Edit BrewNumber >> Internal)
        , viewField name Text (Edit Name >> Internal)
        , viewField style Text (Edit Style >> Internal)
        , viewField abv Number (Edit ABV >> Internal)
        , viewField ibu Number (Edit IBU >> Internal)
        , viewButtons Save Cancel (Utils.and isModified (toNewBrew >> isJust) partial)
        ]


mapChooseImageMsg : Component.ChooseImage.Msg -> InternalMsg
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


uploadImage : File -> Cmd InternalMsg
uploadImage file =
    Http.post
        { url = weightyBeerImageUpload
        , body = Http.multipartBody [ Http.filePart "brewImage" file ]
        , expect = Http.expectJson GotUploadedImageId imageDecoder
        }
