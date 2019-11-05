#!/usr/bin/env bash


### build docker bus prepare
dk_gcl_bus_p=/opt/ddd/ops/docker/hello-dockerfile/projects/gcl3/alpine-bus
#ln -s /opt/ddd/ccpp/gcl3/build/deploy ${dk_gcl_bus_p}/deploy
#ln -s /opt/ddd/ccpp/gcl3/deploy/assets ${dk_gcl_bus_p}/assets
#ln -s /opt/ddd/ccpp/gcl3/deploy/nginx ${dk_gcl_bus_p}/nginx

## delete deploy
rm -r ${dk_gcl_bus_p}/assets
rm -r ${dk_gcl_bus_p}/nginx
rm -r ${dk_gcl_bus_p}/deploy/bin_unix_d

## copy deploy
#cp -r /opt/ddd/ccpp/gcl3/build/deploy ${dk_gcl_bus_p}/deploy
cp -r /opt/ddd/web/limi3/assets/projects/gcl3 ${dk_gcl_bus_p}/assets

## copy binary
mkdir -p ${dk_gcl_bus_p}/deploy/bin_unix_d
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/liblibccxx.so ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_bus ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtdata ${dk_gcl_bus_p}/deploy/bin_unix_d/

### copy config
cp -r /opt/ddd/ccpp/gcl3/deploy/nginx ${dk_gcl_bus_p}/nginx
cp -r /opt/ddd/ccpp/gcl3/deploy/config ${dk_gcl_bus_p}/deploy/
#cp -r /opt/ddd/ccpp/gcl3/deploy/gcl_sdk ${dk_gcl_bus_p}/deploy/bin_unix_d/

### build docker bus build
cd /opt/ddd/ops/docker/hello-dockerfile/projects/gcl3/alpine-bus

## ssh ca RSA
cat ./../../../assets/ssh/identity.pub > ./identity.pub

docker build -t gcl3-bus-alpine .

### run docker bus
# local
docker run -p 2233:22 -p 2281:8821 -d gcl3-bus-alpine
# local debug
docker run -p 2233:22 -p 2281:8821 -it --entrypoint='' gcl3-bus-alpine /bin/sh
# docker hub
docker run -d -p 2233:22 -p 2281:8821 oudream/gcl3-bus-alpine

### ssh
# remote
ssh root@35.232.43.174 -p 2233 -AXY -v # or $(docker-machine ip default)
# local
ssh root@localhost -p 2233 -AXY # or $(docker-machine ip default)

### brower
35.232.43.174:2281
http://35.232.43.174:2281/bus/viewer.html
http://35.232.43.174:2281/bus/poster.html
122.51.12.151:2281


### docker push image
docker login
docker tag gcl3-bus-alpine oudream/gcl3-bus-alpine:1.1
docker push oudream/gcl3-bus-alpine:1.1
docker pull oudream/gcl3-bus-alpine