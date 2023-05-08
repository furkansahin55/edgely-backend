FROM node:18-slim

RUN apt-get update

RUN apt-get install -y openssl

RUN mkdir -p /usr/src/edgely && chown -R node:node /usr/src/edgely

WORKDIR /usr/src/edgely

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
