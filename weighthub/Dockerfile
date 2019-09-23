FROM node:12-alpine

ADD . /weighthub
WORKDIR /weighthub

RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "run", "start:prod" ]