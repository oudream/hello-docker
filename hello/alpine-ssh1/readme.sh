#!/usr/bin/env bash

docker build -t alpine-ssh1 --build-arg ssh_pub_key="$(cat ~/.ssh/id_rsa.pub)" .

docker run --rm --publish=2222:22 alpine-ssh1

ssh root@localhost -p 2222  # or $(docker-machine ip default)
