FROM node:18 AS build
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .
RUN npm run build

RUN ls -la /app/index.js

FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/index.js ./index.js
COPY package*.json ./
RUN npm install --production

EXPOSE 3000
CMD ["node", "index.js"]
