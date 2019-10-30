#!/usr/bin/env bash

cat ~/.ssh/id_rsa.pub > ./identity.pub


docker build -t alpine-ssh1 .

docker run -d -p 2291:22 alpine-ssh1

ssh root@localhost -p 2291 # or $(docker-machine ip default)
ssh root@localhost -p 2291 -AXY # or $(docker-machine ip default)



docker build -t alpine-ssh2 .

docker run -d -p 2292:22 alpine-ssh2

ssh root@localhost -p 2292 # or $(docker-machine ip default)

ssh -AXY -p 2292 root@35.239.31.154
