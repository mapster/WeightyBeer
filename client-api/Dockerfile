FROM node:12-alpine

ADD . /client-api
WORKDIR /client-api

RUN npm install
RUN npm run build

EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start:prod" ]