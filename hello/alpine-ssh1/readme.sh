#!/usr/bin/env bash

docker build -t alpine-ssh4 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run -d -p 2294:22 alpine-ssh4

ssh root@localhost -p 2294 # or $(docker-machine ip default)
