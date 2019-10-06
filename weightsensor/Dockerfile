FROM node:12-alpine

RUN apk update && apk add --no-cache make gcc g++ python linux-headers udev

ADD . /weightsensor
WORKDIR /weightsensor

RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]