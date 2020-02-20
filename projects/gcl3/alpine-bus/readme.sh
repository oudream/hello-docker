#!/usr/bin/env bash


### build docker bus prepare
dk_gcl_bus_p=/opt/limi/hello-docker/projects/gcl3/alpine-bus
#ln -s /opt/ddd/ccpp/gcl3/build/deploy ${dk_gcl_bus_p}/deploy
#ln -s /opt/ddd/ccpp/gcl3/deploy/assets ${dk_gcl_bus_p}/assets

## delete deploy
rm -r ${dk_gcl_bus_p}/assets
rm -r ${dk_gcl_bus_p}/deploy/bin_unix_d

## copy deploy
#cp -r /opt/ddd/ccpp/gcl3/build/deploy ${dk_gcl_bus_p}/deploy
cp -r /opt/ddd/web/limi3/assets/projects/gcl3 ${dk_gcl_bus_p}/assets

## copy binary
mkdir -p ${dk_gcl_bus_p}/deploy/bin_unix_d
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/liblibccxx.so ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/liblibccxx_database_sqlite.so ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_bus ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtdata ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_filesystem ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtlog ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_rtdbs ${dk_gcl_bus_p}/deploy/bin_unix_d/

## copy config
cp -r /opt/ddd/ccpp/gcl3/deploy/config ${dk_gcl_bus_p}/deploy/
#cp -r /opt/ddd/ccpp/gcl3/deploy/gcl_sdk ${dk_gcl_bus_p}/deploy/bin_unix_d/



### build docker bus build
cd /opt/limi/hello-docker/projects/gcl3/alpine-bus

## ssh ca RSA
cat ./../../../assets/ssh/identity.pub > ./identity.pub

## build
docker build -t oudream/gcl3-bus-alpine:1.0.2 .



### run docker bus
# local
docker run -p 2231:22 -p 2232:8821 -d --restart=always oudream/gcl3-bus-alpine:1.0.2
# local debug
docker run -p 2231:22 -p 2232:8821 -it --entrypoint='' oudream/gcl3-bus-alpine:1.0.2 /bin/sh



## ssh
# remote
ssh root@34.66.82.34 -p 2233 -AXY -v # or $(docker-machine ip default)
# local
ssh root@localhost -p 2233 -AXY # or $(docker-machine ip default)

## brower
34.66.82.34:2232
open http://34.66.82.34:2232/bus/viewer.html
open http://34.66.82.34:2232/bus/poster.html
122.51.12.151:2232
## node
node ./httpserver-mock-master.js
## upload
cd /opt/limi/hello-docker/hello/nginx/upload1
sFp1=$PWD/readme.md
curl  -F "file=@${sFp1};type=text/plain;filename=a1" 34.66.82.34:2232/upload


### docker push image
docker login
docker tag gcl3-bus-alpine oudream/gcl3-bus-alpine:1.0.2
docker push oudream/gcl3-bus-alpine:1.0.2
docker pull oudream/gcl3-bus-alpine:1.0.2

