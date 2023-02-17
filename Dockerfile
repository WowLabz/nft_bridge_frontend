FROM node:lts-alpine3.17

RUN apk update \
    && apk add git

WORKDIR /nftbridge_frontend

COPY . .

RUN yarn install

EXPOSE 2245

CMD ["yarn", "start"]
