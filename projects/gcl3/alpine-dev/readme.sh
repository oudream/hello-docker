#!/usr/bin/env bash

cat ~/../../../assets/ssh/identity.pub > ./identity.pub

docker build -t gcl3-dev-alpine .

docker run -d -p 2231:22 gcl3-dev-alpine

ssh root@localhost -p 2231 # or $(docker-machine ip default)
ssh root@localhost -p 2231 -AXY # or $(docker-machine ip default)
