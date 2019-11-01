#!/usr/bin/env bash

cat ~/../../../assets/ssh/identity.pub > ./identity.pub

docker build -t gcl3-bus-alpine .

docker run -d -p 2233:22 gcl3-bus-alpine

ssh root@localhost -p 2233 # or $(docker-machine ip default)


