#!/usr/bin/env bash

docker build -t python3a .

docker run -d python3a

docker exec -e DISPLAY=$DISPLAY -dti 05201d90750e /bin/sh