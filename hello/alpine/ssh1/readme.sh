#!/usr/bin/env bash

docker build -t alpine-ssh1 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2291:22 -l test alpine-ssh1

ssh root@localhost -p 2291 # or $(docker-machine ip default)


docker build -t alpine-ssh9 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2299:22 -l test alpine-ssh9

ssh root@localhost -p 2299 # or $(docker-machine ip default)


cat ~/.ssh/id_rsa.pub > ./identity.pub

docker build -t alpine-ssh8 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2298:22 -l test alpine-ssh8

ssh root@localhost -p 2298 # or $(docker-machine ip default)



cat ~/.ssh/id_rsa.pub > ./identity.pub

docker build -t alpine-ssh7 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2297:22 -l test alpine-ssh7

ssh root@localhost -p 2297 # or $(docker-machine ip default)



cat ~/.ssh/id_rsa.pub > ./identity.pub

docker build -t alpine-ssh6 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2296:22 -l test alpine-ssh6

ssh root@localhost -p 2296 # or $(docker-machine ip default)



cat ~/.ssh/id_rsa.pub > ./identity.pub

docker build -t alpine-ssh5 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2295:22 -l test alpine-ssh5

ssh root@localhost -p 2295 # or $(docker-machine ip default)



cat ~/.ssh/id_rsa.pub > ./identity.pub

docker build -t alpine-ssh4 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2294:22 -l test alpine-ssh4

ssh root@localhost -p 2294 # or $(docker-machine ip default)



cat ~/.ssh/id_rsa.pub > ./identity.pub

docker build -t alpine-ssh3 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2293:22 -l test alpine-ssh3

ssh root@localhost -p 2293 # or $(docker-machine ip default)

