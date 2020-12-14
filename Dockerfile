FROM node:14 as build

RUN mkdir /workdir
WORKDIR /workdir

COPY . .

RUN npm run install --registry=https://registry.npm.vmatrix.org.cn --unsafe-perm \
    && npm run doc:build
    && npm run build

ENTRYPOINT npm start prod
