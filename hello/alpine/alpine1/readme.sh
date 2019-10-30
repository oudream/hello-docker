#!/usr/bin/env bash

docker build -t gcl3-ubuntu .

docker run -d python3a

gcc pthreads_demo.c -lpthread -o pthreads_demo