FROM node:lts-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY . .

FROM node:lts-alpine AS runtime

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

EXPOSE 3000

CMD ["npm", "start"]