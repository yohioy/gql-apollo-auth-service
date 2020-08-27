FROM node:12.16

# Create app directory
WORKDIR /usr/src/app

COPY /package.json ./

COPY . .

RUN ["apt-get", "update"]
RUN ["apt-get", "-y", "install", "nano"]

EXPOSE 4022

CMD [ "node", "index.js" ]
