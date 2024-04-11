FROM node as build

WORKDIR /frontend

COPY package.json . /frontend

RUN yarn install

COPY . .

RUN yarn build

FROM node as production

WORKDIR /frontend

COPY --from=build /frontend/.next ./.next
COPY --from=build /frontend/package.json ./package.json
COPY --from=build /frontend/public ./public
COPY --from=build /frontend/node_modules ./node_modules
COPY --from=build /frontend/next.config.js ./
