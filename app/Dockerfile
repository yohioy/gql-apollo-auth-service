FROM node:12.16

# Create app directory
WORKDIR /usr/src/app

COPY /dist/package.json ./

RUN npm install

COPY /dist/ .

EXPOSE 4022

CMD [ "node", "index.js" ]
