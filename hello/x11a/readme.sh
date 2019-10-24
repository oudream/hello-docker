#!/usr/bin/env bash

To get up and running, build it, then:

docker run -it --rm -p 2150:22 firefox

Add this to ~/.ssh/config on the client

Host abc
     Hostname HOST_NAME_HERE
     Port 2150
     user root
     ForwardX11 yes
     ForwardX11Trusted yes
Connect from client with:

ssh -X root@abc firefox


docker build -t x11a .

docker run -it --rm -p 2150:22 firefox
docker run -d x11a

docker exec -e DISPLAY=$DISPLAY -dti 05201d90750e /bin/sh