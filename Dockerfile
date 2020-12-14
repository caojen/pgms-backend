FROM node:14 as build

RUN mkdir /workdir
WORKDIR /workdir

COPY . .

RUN npm install --registry=https://registry.npm.taobao.org --unsafe-perm \
    && npm run doc:build \
    && npm run build

ENTRYPOINT npm start prod
