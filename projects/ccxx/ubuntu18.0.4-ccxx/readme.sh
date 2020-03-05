#!/usr/bin/env bash


# build dockerfile
docker build -t oudream/ubuntu-ccxx-env:18.04.12 .


# run on vps
docker run -d -p 2235:22 -v /opt/ddd:/opt/ddd oudream/ubuntu-ccxx-env:18.04.12
ssh root@35.232.43.174 -p 2235 -AXY -v


# run on macos(localhost)
docker run -d -p 2235:22 -p 8821:8821 -p 8841:8841 -p 8861:8861 -v /opt/ddd:/opt/ddd oudream/ubuntu-ccxx-env:18.04.12
ssh root@localhost -p 2235 -AXY -v


docker login
docker push oudream/ubuntu-ccxx-env:18.04.12
