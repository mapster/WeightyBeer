FROM node:12-alpine AS build

ADD . /elm-client
WORKDIR /elm-client

RUN npm install
RUN npm run dist

## Host stage
FROM nginx
COPY --from=build /elm-client/dist /usr/share/nginx/html