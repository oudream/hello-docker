#!/usr/bin/env bash


# build dockerfile
cat ./../../../assets/ssh/identity.pub > ./identity.pub
docker build -t oudream/puppeteer-dev-alpine:1.1 .


# run on vps
docker run -d -p 2231:22 -p 8821:8821 -p 8841:8841 -p 8861:8861 -v /opt/ddd:/opt/ddd oudream/puppeteer-dev-alpine:1.1
# on vps
ssh -AXY root@34.69.62.252
# on macos
ssh root@34.69.62.252 -p 2231 -AXY -v # or $(docker-machine ip default)


# run on macos(localhost)
docker run -d -p 2231:22 -p 8821:8821 -p 8841:8841 -p 8861:8861 oudream/puppeteer-dev-alpine:1.1
ssh root@localhost -p 2231 -AXY -v
