#!/usr/bin/env bash

docker build -t alpine-ssh1 .

docker run -d -p 2291:22 alpine-ssh6

ssh root@localhost -p 2291 # or $(docker-machine ip default)
