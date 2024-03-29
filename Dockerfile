FROM mhart/alpine-node:12

WORKDIR /usr/src/app

COPY . .

RUN npm set progress=false
RUN npm ci
RUN npm run build

COPY package.json ./dist
COPY .default ./.env
COPY src/plugins/apollo/auth-module/*.graphql ./dist/plugins/apollo/auth-module/

EXPOSE 4022

CMD ["npm", "run", "start"]
