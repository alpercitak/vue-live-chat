FROM node:18-alpine AS base

WORKDIR /app
RUN npm i -g pnpm

FROM base AS build-lib

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY lib ./lib
RUN pnpm install --filter ./lib
RUN pnpm run --filter ./lib build

FROM base AS build-server

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=build-lib /app/lib ./lib

COPY server ./server
RUN pnpm install --filter ./server
RUN pnpm run --filter ./server build
RUN pnpm recursive install --prod

FROM base AS deploy-server

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build-server /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=build-server /app/server/node_modules ./server/node_modules
COPY --from=build-server /app/server/dist ./server/dist
COPY --from=build-server /app/lib ./lib
CMD ["node", "server/dist/index.js"]

FROM base AS build-client

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=build-lib /app/lib ./lib

COPY client ./client
RUN pnpm install --filter ./client
RUN pnpm run --filter ./client build

FROM nginx:1.18-alpine AS deploy-client

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-client /app/client/dist .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]