FROM node:12-alpine

ADD . /weightsim
WORKDIR /weightsim

RUN npm install

ENTRYPOINT [ "npm", "run", "start:redis" ]
CMD [ "simtap1" ]