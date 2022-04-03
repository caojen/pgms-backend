FROM node:14 as build

RUN mkdir /workdir
WORKDIR /workdir

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .
RUN npm run build

ENV MYSQL_HOST=docker.for.mac.host.internal
ENV MYSQL_PORT=3306
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=opentextfile+123
ENV MYSQL_DATABASE=pgms
ENV FILE_SYSTEM=http://docker.for.mac.host.internal
ENV FILE_SYSTEM_LOOKUP=:9333/dir/assign

CMD ["node", "./dist/src//main.js"]
