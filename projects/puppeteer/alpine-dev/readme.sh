#!/usr/bin/env bash

#
# https://github.com/GoogleChrome/puppeteer/issues/1793
#

# build dockerfile
cat ./../../../assets/ssh/identity.pub > ./identity.pub
docker build -t oudream/puppeteer-dev-alpine:1.2 .


# run on vps
docker run -d -p 2231:22 -p 8821:8821 -p 8841:8841 -p 8861:8861 -v /opt/ddd:/opt/ddd oudream/puppeteer-dev-alpine:1.2
# on vps
ssh -AXY root@34.69.62.252
# on macos
ssh root@34.69.62.252 -p 2231 -AXY -v # or $(docker-machine ip default)


# run on macos(localhost)
docker run -d -p 2231:22 -p 8821:8821 -p 8841:8841 -p 8861:8861 oudream/puppeteer-dev-alpine:1.2
ssh root@localhost -p 2231 -AXY -v


### docker push image
docker login
docker tag puppeteer-dev-alpine oudream/puppeteer-dev-alpine:1.2
docker push oudream/puppeteer-dev-alpine:1.2
docker pull oudream/puppeteer-dev-alpine
