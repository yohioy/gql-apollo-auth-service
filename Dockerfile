FROM mhart/alpine-node:12

# Create app directory
WORKDIR /usr/src/app

# todo complete details

COPY . .

RUN npm ci --no-progress
RUN npm build

EXPOSE 4022

CMD ["npm", "run", "start:deployed"]
