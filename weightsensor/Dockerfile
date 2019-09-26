FROM node:12-alpine

ADD . /weightsensor
WORKDIR /weightsensor

RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]