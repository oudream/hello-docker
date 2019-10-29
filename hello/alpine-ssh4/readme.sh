#!/usr/bin/env bash

cat ~/.ssh/id_rsa.pub > ./identity.pub


docker build -t alpine-ssh5 .

docker run -d -p 2295:22 alpine-ssh5

ssh root@localhost -p 2295 # or $(docker-machine ip default)



docker build -t alpine-ssh6 .

docker run -d -p 2296:22 alpine-ssh6

ssh root@localhost -p 2296 # or $(docker-machine ip default)
