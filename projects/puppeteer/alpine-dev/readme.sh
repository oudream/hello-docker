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


### test
git clone https://github.com/oudream/hello-puppeteer.git /opt/ddd/ops/puppeteer/hello-puppeteer && \
docker run -itd -v /opt/ddd/ops/puppeteer/hello-puppeteer:/opt/ddd/ops/puppeteer/hello-puppeteer --restart=always --entrypoint="" \
    oudream/puppeteer-dev-alpine:1.2 node /opt/ddd/ops/puppeteer/hello-puppeteer/projects/gcl3/bus/poster-enabled-timer.js

docker run -itd -v /opt/ddd/ops/puppeteer/hello-puppeteer:/opt/ddd/ops/puppeteer/hello-puppeteer --entrypoint="" \
    oudream/puppeteer-dev-alpine:1.2 /bin/sh


# error
# npm i puppeteer # error at launch
# (node:37) UnhandledPromiseRejectionWarning: Error: Failed to launch chrome! spawn /node_modules/puppeteer/.local-chromium/linux-706915/chrome-linux/chrome ENOENT
# npm i puppeteer # Unfortunately this is not enough.
# You will require the following Dependencies
# sudo apt-get install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2
# libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0
# libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1
# libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2
# libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3
# lsb-release xdg-utils wget
### https://stackoverflow.com/questions/52993002/headless-chrome-node-api-and-puppeteer-installation

