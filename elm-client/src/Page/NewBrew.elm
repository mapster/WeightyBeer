module Page.NewBrew exposing (Model, Msg, getError, init, subscriptions, update, view)

import Browser.Navigation as Nav
import Component.EditBrew exposing (Field)
import Component.ErrorDetails exposing (ErrorDetails, errorDetails)
import Constants exposing (weightyBeerGraphql)
import File exposing (File)
import File.Select as Select
import Graphql.Http
import Html exposing (Html, div)
import Html.Attributes exposing (class)
import Http
import Route
import Type.Brew as Brew exposing (Brew, Image, PartialBrew, emptyPartial, imageSelection, makeDeleteImageRequest, toNewBrew, toPartial)
import Type.ImageID as ImageID exposing (ImageID)
import WeightyBeer.Query as Query


type alias Model =
    { navKey : Nav.Key
    , mutation : PartialBrew
    , showGallery : Bool
    , images : List Image
    , error : Maybe ErrorDetails
    }


type Msg
    = Edit Field String
    | Save
    | Cancel
    | ToggleGallery
    | GotImagesResponse ImagesResponse
    | RequestImageUpload
    | UploadImage File
    | GotUploadedImageId (Result Http.Error Image)
    | DeleteImage ImageID
    | GotDeletedImageResponse (Result (Graphql.Http.Error ()) (Maybe Image))
    | GotSaveResponse SaveResponse


type alias SaveResponse =
    Result (Graphql.Http.Error ()) Brew


type alias ImagesResponse =
    Result (Graphql.Http.Error ()) (List Image)


requestImages : Cmd Msg
requestImages =
    Query.images imageSelection
        |> Graphql.Http.queryRequest weightyBeerGraphql
        |> Graphql.Http.send (Graphql.Http.discardParsedErrorData >> GotImagesResponse)


getError : Model -> Maybe ErrorDetails
getError =
    .error


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


init : Nav.Key -> ( Model, Cmd Msg )
init navKey =
    ( Model navKey emptyPartial False [] Nothing, requestImages )


makeSaveRequest : Model -> ( Model, Cmd Msg )
makeSaveRequest model =
    case toNewBrew model.mutation of
        Just brew ->
            ( model, Brew.makeMutationRequest (Brew.createRequest brew Brew.brewSelection) GotSaveResponse )

        Nothing ->
            ( { model | error = Just (ErrorDetails "Cannot save: incomplete tap" Nothing) }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Edit field value ->
            ( { model | mutation = Component.EditBrew.update model.images model.mutation field value }, Cmd.none )

        Save ->
            makeSaveRequest model

        GotSaveResponse response ->
            updateFromSaveResponse model response

        Cancel ->
            ( model, navigateToBrews model.navKey )

        ToggleGallery ->
            ( { model | showGallery = not model.showGallery }, Cmd.none )

        GotImagesResponse imagesResponse ->
            ( updateImages model imagesResponse, Cmd.none )

        RequestImageUpload ->
            ( model, Select.file [ "image/jpeg", "image/png" ] UploadImage )

        UploadImage file ->
            ( model, Component.EditBrew.uploadImage GotUploadedImageId file )

        GotUploadedImageId result ->
            updateFromUploadedImage model result

        DeleteImage imageID ->
            ( model, makeDeleteImageRequest imageID GotDeletedImageResponse )

        GotDeletedImageResponse response ->
            updateFromDeleteImage model response


updateFromSaveResponse : Model -> SaveResponse -> ( Model, Cmd Msg )
updateFromSaveResponse model response =
    case response of
        Err error ->
            ( { model | error = Just (errorDetails "Failed to save brew" error) }, Cmd.none )

        Ok data ->
            ( { model | mutation = toPartial data }, navigateToBrews model.navKey )


updateFromDeleteImage : Model -> Result (Graphql.Http.Error ()) (Maybe Image) -> ( Model, Cmd Msg )
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


updateFromUploadedImage : Model -> Result Http.Error Image -> ( Model, Cmd Msg )
updateFromUploadedImage model result =
    case result of
        Ok image ->
            let
                images =
                    image :: model.images

                mutation =
                    Component.EditBrew.update images model.mutation Component.EditBrew.Image (ImageID.toString image.id)
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


navigateToBrews : Nav.Key -> Cmd Msg
navigateToBrews =
    Route.replaceUrl Route.Brews


view : Model -> Html Msg
view model =
    div [ class "single-card-page-container" ]
        [ Html.map mapEditBrewMsg <| Component.EditBrew.view model.images model.mutation model.showGallery
        ]


mapEditBrewMsg : Component.EditBrew.Msg -> Msg
mapEditBrewMsg msg =
    case msg of
        Component.EditBrew.Edit field value ->
            Edit field value

        Component.EditBrew.Save ->
            Save

        Component.EditBrew.Cancel ->
            Cancel

        Component.EditBrew.ToggleGallery ->
            ToggleGallery

        Component.EditBrew.RequestImageUpload ->
            RequestImageUpload

        Component.EditBrew.DeleteImage id ->
            DeleteImage id
