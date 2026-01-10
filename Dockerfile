FROM nginx:1.29.4-alpine-slim AS deploy-server-load-balancer

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY ./server/nginx.conf /etc/nginx/nginx.conf
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

FROM node:25-alpine AS base

WORKDIR /app
RUN npm i -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .

FROM base AS build-server

WORKDIR /app

RUN pnpm i -r --offline --filter="vue-live-chat-server"
RUN pnpm turbo build --filter="vue-live-chat-server"

RUN rm -rf ./node_modules
RUN rm -rf ./server/node_modules
RUN pnpm install -r --offline --prod --filter="vue-live-chat-server"

FROM node:25-alpine AS deploy-server

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build-server /app/node_modules/ ./node_modules
COPY --from=build-server /app/server/node_modules ./server/node_modules
COPY --from=build-server /app/server/dist ./server/dist

CMD ["node", "server/dist/index.mjs"]

FROM base AS build-client

WORKDIR /app

RUN pnpm i -r --offline --filter="vue-live-chat-client"
RUN pnpm turbo build --filter="vue-live-chat-client"

FROM nginx:1.29.4-alpine-slim AS deploy-client

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-client /app/client/dist .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]