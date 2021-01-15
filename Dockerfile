FROM node:15-alpine

WORKDIR /coffaine-deliveries
COPY package.json .
COPY package-lock.json .
RUN npm install

WORKDIR /coffaine-deliveries
COPY env env
COPY source source

EXPOSE 3000

CMD npm run start:prod