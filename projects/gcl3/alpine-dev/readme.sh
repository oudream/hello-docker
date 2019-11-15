#!/usr/bin/env bash


# build dockerfile
cat ./../../../assets/ssh/identity.pub > ./identity.pub
docker build -t gcl3-dev-alpine .


# run on vps
docker run -d -p 2231:22 -p 8821:8821 -p 8841:8841 -p 8861:8861 -v /opt/ddd:/opt/ddd gcl3-dev-alpine
# on vps
ssh -AXY root@35.232.43.174
# on macos
ssh root@35.232.43.174 -p 2231 -AXY -v # or $(docker-machine ip default)


# run on macos(localhost)
docker run -d -p 2231:22 -p 8821:8821 -p 8841:8841 -p 8861:8861 gcl3-dev-alpine
ssh root@localhost -p 2231 -AXY -v
