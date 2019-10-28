#!/usr/bin/env bash

docker build -t gcl3-ubuntu .

docker run -d -p 2201:22 gcl3-ubuntu

ssh -AXY -p 2201 root@35.239.31.154
