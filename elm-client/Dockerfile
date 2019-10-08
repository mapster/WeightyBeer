FROM node:12-alpine AS build

ADD . /elm-client
WORKDIR /elm-client

RUN npm run resources

## Host stage
FROM nginx
COPY nginx /etc/nginx/conf.d
COPY --from=build /elm-client/dist /usr/share/nginx/html