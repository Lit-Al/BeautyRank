FROM node:21 as builder

WORKDIR /app    

COPY package.json package-lock.json . 

RUN yarn install

RUN yarn build

FROM node:21-alpine

WORKDIR /app

COPY --from=builder /app/dist .

EXPOSE 3000

CMD ["yarn", "start"]

