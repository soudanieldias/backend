### Build the Prisma engine
FROM rust:1.58.1-alpine3.14 as prisma
ENV RUSTFLAGS="-C target-feature=-crt-static"
RUN apk --no-cache add openssl direnv git musl-dev openssl-dev build-base perl protoc
RUN git clone --depth=1 --branch=3.9.0 https://github.com/prisma/prisma-engines.git /prisma
WORKDIR /prisma
RUN cargo build --release --jobs 1

# To reduce the image size we use a multi-stage build approach, see https://bit.ly/3vMZjNu.
### First stage ###
FROM node:lts AS builder

RUN apt-get install -y curl openssl

WORKDIR /app

ENV PRISMA_QUERY_ENGINE_BINARY=/prisma-engines/query-engine \
  PRISMA_MIGRATION_ENGINE_BINARY=/prisma-engines/migration-engine \
  PRISMA_INTROSPECTION_ENGINE_BINARY=/prisma-engines/introspection-engine \
  PRISMA_FMT_BINARY=/prisma-engines/prisma-fmt \
  PRISMA_CLI_QUERY_ENGINE_TYPE=binary \
  PRISMA_CLIENT_ENGINE_TYPE=binary
COPY --from=prisma /prisma/target/release/query-engine /prisma/target/release/migration-engine /prisma/target/release/introspection-engine /prisma/target/release/prisma-fmt /prisma-engines/

COPY ./yarn.lock ./package.json ./

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn prisma generate
RUN yarn build

RUN npm prune --production

####################

FROM node:16-alpine
# WORKDIR /backend
# COPY . .
# COPY prisma ./prisma/
# RUN npx prisma migrate dev
# RUN npx prisma db seed
# RUN npm install
# EXPOSE 3001
# CMD [ "npm", "run", "dev" ]

# FROM node:16.18.1-alpine3.16
WORKDIR /home/node/app
COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./

RUN npm install
RUN npx prisma generate
RUN npm run prestart

EXPOSE 3001

COPY . .
RUN npm run build

CMD [ "node", "dist/src/main.js" ]
