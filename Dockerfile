FROM node:18-alpine AS base

WORKDIR /app
RUN npm i -g pnpm

FROM base AS build-server

WORKDIR /app
COPY ./server/package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY ./server .
RUN pnpm run build
RUN pnpm prune --prod

FROM base AS deploy-server

WORKDIR /app
COPY --from=build-server /app/node_modules ./node_modules
COPY --from=build-server /app/dist .
CMD ["node", "index.js"]

FROM base AS build-client

WORKDIR /app
COPY ./client/package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY ./client .
RUN pnpm run build

FROM nginx:1.18-alpine AS deploy-client

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-client /app/dist .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]