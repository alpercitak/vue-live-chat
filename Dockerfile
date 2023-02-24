FROM nginx:1.23.3-alpine AS deploy-server-load-balancer

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY ./server/nginx.conf /etc/nginx/nginx.conf
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

FROM node:18-alpine AS base

WORKDIR /app
RUN npm i -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch

FROM base AS build-lib

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY lib ./lib
RUN pnpm install -r --offline --filter ./lib
RUN pnpm run --filter ./lib build

RUN rm -rf ./node_modules
RUN pnpm install -r --offline --prod --filter ./lib

FROM base AS build-server

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=build-lib /app/lib ./lib

COPY server ./server
RUN pnpm install -r --offline --filter ./server
RUN pnpm run --filter ./server build

RUN rm -rf ./node_modules
RUN rm -rf ./server/node_modules
RUN pnpm install -r --offline --prod --filter ./server

FROM node:18-alpine AS deploy-server

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build-server /app/node_modules/ ./node_modules
COPY --from=build-server /app/server/node_modules ./server/node_modules
COPY --from=build-server /app/server/dist ./server/dist
COPY --from=build-server /app/lib ./lib
CMD ["node", "server/dist/index.js"]

FROM base AS build-client

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=build-lib /app/lib ./lib

COPY client ./client
RUN pnpm install -r --offline --filter ./client
RUN pnpm run --filter ./client build

FROM nginx:1.23.3-alpine AS deploy-client

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-client /app/client/dist .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]