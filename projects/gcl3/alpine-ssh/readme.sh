#!/usr/bin/env bash

docker build -t gcl3-alpine-ssh .

docker run -d -v /opt/ddd -p 2202:22 gcl3-alpine-ssh

ssh -AXY -p 2202 root@35.239.31.154
ssh -AXY -p 2202 root@localhost
