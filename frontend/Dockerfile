FROM node

WORKDIR /app    

COPY package.json . /app

RUN yarn install

RUN yarn build

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]