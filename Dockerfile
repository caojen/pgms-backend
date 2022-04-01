FROM node:14 as build

RUN mkdir /workdir
WORKDIR /workdir

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .
RUN npm run build

ENV MYSQL_HOST=127.0.0.1
ENV MYSQL_PORT=3306
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=opentextfile+123
ENV MYSQL_DATABASE=pgms
ENV FILE_SYSTEM=http://127.0.0.1
ENV FILE_SYSTEM_LOOKUP=:9333/dir/assign

CMD ["node", "./dist/src//main.js"]
