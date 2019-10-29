#!/usr/bin/env bash

cat ~/.ssh/id_rsa.pub > ./identity.pub


docker build -t alpine-ssh3 .

docker run -d -p 2293:22 alpine-ssh3

ssh root@localhost -p 2293 # or $(docker-machine ip default)



docker build -t alpine-ssh4 .

docker run -d -p 2294:22 alpine-ssh4

ssh root@localhost -p 2294 # or $(docker-machine ip default)
