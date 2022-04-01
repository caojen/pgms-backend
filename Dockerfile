FROM node:14 as build

RUN mkdir /workdir
WORKDIR /workdir

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .
RUN npm run build

CMD ["node", "./dist/main.js"]
