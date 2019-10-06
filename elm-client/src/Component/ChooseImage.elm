module Component.ChooseImage exposing (Msg(..), view)

import Component.Button as Button
import Component.Icon exposing (Icon(..), icon)
import Html exposing (Html, button, div, h2, text)
import Html.Attributes exposing (class, style, type_)
import Html.Events exposing (onClick, stopPropagationOn)
import Json.Decode
import Type.Brew exposing (Image)
import Type.ImageID exposing (ImageID)


type Msg
    = ToggleGallery
    | SelectImage Image
    | DeselectImage
    | RequestImageUpload
    | DeleteImage ImageID


view : List Image -> Maybe Image -> Bool -> Html Msg
view images current showGallery =
    let
        gallery =
            case showGallery of
                False ->
                    []

                True ->
                    [ viewGallery images current ]
    in
    div [ class "choose-image-component" ]
        ([ viewImage current
         , viewButtons
         ]
            ++ gallery
        )


viewGallery : List Image -> Maybe Image -> Html Msg
viewGallery images current =
    div [ class "modal", onClick ToggleGallery ]
        [ div [ class "image-gallery", stopPropagationOn "click" (Json.Decode.succeed ( ToggleGallery, False )) ]
            [ h2 [] [ text "Image gallery" ]
            , viewImages images current
            , Button.view ToggleGallery "Done"
            ]
        ]


viewImages : List Image -> Maybe Image -> Html Msg
viewImages images current =
    div [ class "wrapped-cards-container" ] (List.map (viewImageCard current) images)


viewImageCard : Maybe Image -> Image -> Html Msg
viewImageCard current image =
    let
        ( selectOnClick, selectIcon ) =
            case
                Maybe.map ((==) image) current
                    |> Maybe.withDefault False
            of
                True ->
                    ( DeselectImage, Favorite )

                False ->
                    ( SelectImage image, FavoriteOutline )
    in
    div [ class "image-card", style "background-image" ("url(" ++ image.url ++ ")") ]
        [ div [ class "buttons" ]
            [ button [ class "text-button", type_ "button", onClick (DeleteImage image.id) ] [ icon Delete ]
            , button [ class "text-button", type_ "button", onClick selectOnClick ] [ icon selectIcon ]
            ]
        ]


viewButtons : Html Msg
viewButtons =
    div [ class "buttons" ]
        [ Button.view ToggleGallery "Choose image"
        , Button.view RequestImageUpload "Upload image"
        ]


viewImage : Maybe Image -> Html Msg
viewImage maybe =
    case maybe of
        Just image ->
            viewImageCard maybe image

        Nothing ->
            div [ class "image-card" ] []
