#!/usr/bin/env bash

docker build -t alpine-ssh5 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2226:22 alpine-ssh6

ssh root@localhost -p 2227 # or $(docker-machine ip default)
