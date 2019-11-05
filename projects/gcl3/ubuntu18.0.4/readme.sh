#!/usr/bin/env bash

docker build -t gcl3-ubuntu .

docker run -d -p 2235:22 -v /opt/ddd:/opt/ddd gcl3-ubuntu

docker run -d -p 2235:22 gcl3-ubuntu

ssh root@34.70.120.90 -AXY -v

ssh root@34.70.120.90 -p 2235 -AXY -v



docker run -d -p 2235:22 -p 8821:8821 -p 8841:8841 -p 8861:8861 084

ssh root@localhost -p 2235 -AXY -v










