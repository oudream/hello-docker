#!/usr/bin/env bash

docker build -t alpine-ssh1 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2291:22 -l test alpine-ssh1

ssh root@localhost -p 2291 # or $(docker-machine ip default)


cat ~/.ssh/id_rsa.pub > ./identity.pub

docker build -t alpine-ssh9 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2299:22 -l test alpine-ssh9

ssh root@localhost -p 2299 # or $(docker-machine ip default)

