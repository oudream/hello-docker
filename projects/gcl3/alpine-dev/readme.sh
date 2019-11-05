#!/usr/bin/env bash

cat ./../../../assets/ssh/identity.pub > ./identity.pub

docker build -t gcl3-dev-alpine .

docker run -v /opt/ddd:/opt/ddd -d -p 2231:22 gcl3-dev-alpine

ssh root@localhost -p 2231 # or $(docker-machine ip default)

ssh root@34.70.120.90 -p 2231 -AXY -v # or $(docker-machine ip default)

ssh -AXY root@34.70.120.90
