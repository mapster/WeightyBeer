module Main exposing (Model, Msg(..), Page(..), PageMsg(..), changeRouteTo, init, main, setPage, subscriptions, update, updatePage, updateWith, view, viewMenu, viewMenuEntry, viewPage)

import Browser
import Browser.Navigation as Nav
import Component.ErrorDetails as ErrorDetails
import Html exposing (Html, a, div)
import Html.Attributes exposing (class)
import Page.EditTap as EditTap
import Page.Home as Home
import Page.NewTap as NewTap
import Page.Taps as Taps
import Route exposing (Route, href)
import Url exposing (Url)
import Utils exposing (textEl)


main =
    Browser.application
        { init = init
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        , view = \model -> { title = "WeightyBeer", body = [ view model ] }
        , update = update
        , subscriptions = subscriptions
        }


type Msg
    = ChangedUrl Url
    | ClickedLink Browser.UrlRequest
    | ToPage PageMsg
    | ShowErrorDetails


type PageMsg
    = HomeMsg Home.Msg
    | TapsMsg Taps.Msg
    | NewTapMsg NewTap.Msg
    | EditTapMsg EditTap.Msg


type alias Model =
    { navKey : Nav.Key
    , route : Maybe Route
    , page : Page
    , showErrorDetails : Bool
    }


type Page
    = NotFound
    | Home Home.Model
    | Taps Taps.Model
    | NewTap NewTap.Model
    | EditTap EditTap.Model


setPage : Model -> Page -> Model
setPage model page =
    { model | page = page }


init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    let
        route =
            Route.fromUrl url

        ( page, cmd ) =
            changeRouteTo key route
    in
    ( Model key route page False, Cmd.map ToPage cmd )


changeRouteTo : Nav.Key -> Maybe Route -> ( Page, Cmd PageMsg )
changeRouteTo navKey maybeRoute =
    case maybeRoute of
        Nothing ->
            ( NotFound, Cmd.none )

        Just Route.Home ->
            Home.init
                |> updateWith Home HomeMsg

        Just Route.Taps ->
            Taps.init
                |> updateWith Taps TapsMsg

        Just Route.NewTap ->
            NewTap.init navKey
                |> updateWith NewTap NewTapMsg

        Just (Route.EditTap id) ->
            EditTap.init navKey id
                |> updateWith EditTap EditTapMsg


updateWith : (srcModel -> targetModel) -> (srcMsg -> targetMsg) -> ( srcModel, Cmd srcMsg ) -> ( targetModel, Cmd targetMsg )
updateWith modelMap cmdMap ( page, cmd ) =
    ( modelMap page, Cmd.map cmdMap cmd )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ClickedLink urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.navKey (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        ChangedUrl url ->
            changeRouteTo model.navKey (Route.fromUrl url)
                |> updateWith (setPage model) ToPage

        ToPage pageMsg ->
            updatePage pageMsg model

        ShowErrorDetails ->
            ( { model | showErrorDetails = not model.showErrorDetails }, Cmd.none )


updatePage : PageMsg -> Model -> ( Model, Cmd Msg )
updatePage msg model =
    case msg of
        HomeMsg homeMsg ->
            case model.page of
                Home home ->
                    Home.update homeMsg home
                        |> updateWith (Home >> setPage model) (HomeMsg >> ToPage)

                _ ->
                    ( model, Cmd.none )

        TapsMsg tapsMsg ->
            case model.page of
                Taps taps ->
                    Taps.update tapsMsg taps
                        |> updateWith (Taps >> setPage model) (TapsMsg >> ToPage)

                _ ->
                    ( model, Cmd.none )

        NewTapMsg newTapMsg ->
            case model.page of
                NewTap newTap ->
                    NewTap.update newTapMsg newTap
                        |> updateWith (NewTap >> setPage model) (NewTapMsg >> ToPage)

                _ ->
                    ( model, Cmd.none )

        EditTapMsg editTapMsg ->
            case model.page of
                EditTap editTap ->
                    EditTap.update editTapMsg editTap
                        |> updateWith (EditTap >> setPage model) (EditTapMsg >> ToPage)

                _ ->
                    ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.page of
        NotFound ->
            Sub.none

        Home home ->
            Sub.map (HomeMsg >> ToPage) (Home.subscriptions home)

        Taps taps ->
            Sub.map (TapsMsg >> ToPage) (Taps.subscriptions taps)

        NewTap newTap ->
            Sub.map (NewTapMsg >> ToPage) (NewTap.subscriptions newTap)

        EditTap editTap ->
            Sub.map (EditTapMsg >> ToPage) (EditTap.subscriptions editTap)


view : Model -> Html Msg
view model =
    div [ class "app-container" ]
        [ viewMenu
        , div [ class "vertical-space" ] []
        , viewPage model.page
        , div [ class "vertical-space" ] []
        , viewErrors model
        ]


viewPage : Page -> Html Msg
viewPage page =
    div [ class "page-container" ]
        [ case page of
            NotFound ->
                div [] [ textEl "Not found" ]

            Home home ->
                Html.map (HomeMsg >> ToPage) (Home.view home)

            Taps taps ->
                Html.map (TapsMsg >> ToPage) (Taps.view taps)

            NewTap newTap ->
                Html.map (NewTapMsg >> ToPage) (NewTap.view newTap)

            EditTap editTap ->
                Html.map (EditTapMsg >> ToPage) (EditTap.view editTap)
        ]


viewErrors : Model -> Html Msg
viewErrors model =
    let
        errorDetails =
            case model.page of
                NotFound ->
                    Nothing

                Home homeModel ->
                    Nothing

                Taps tapsModel ->
                    Nothing

                NewTap newTapModel ->
                    NewTap.getError newTapModel

                EditTap editTapModel ->
                    EditTap.getError editTapModel
    in
    case errorDetails of
        Just error ->
            ErrorDetails.view ShowErrorDetails model.showErrorDetails error

        Nothing ->
            div [] []


viewMenu : Html Msg
viewMenu =
    div [ class "page-menu" ]
        [ viewMenuEntry "Home" Route.Home
        , viewMenuEntry "Taps" Route.Taps
        , viewMenuEntry "Brews" Route.Taps
        , viewMenuEntry "Weight Hub" Route.Taps
        , div [ class "space" ] []
        ]


viewMenuEntry : String -> Route -> Html Msg
viewMenuEntry title route =
    div [ class "entry" ]
        [ a [ href route ] [ textEl title ] ]