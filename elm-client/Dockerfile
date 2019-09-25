FROM node:12-alpine

RUN apk update
RUN apk add --no-cache ghc

ADD . /elm-client
WORKDIR /elm-client

RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]