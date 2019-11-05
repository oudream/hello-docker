#!/usr/bin/env bash


### build docker bus
dk_gcl_bus_p=/opt/ddd/ops/docker/hello-dockerfile/projects/gcl3/alpine-bus
#ln -s /opt/ddd/ccpp/gcl3/build/deploy ${dk_gcl_bus_p}/deploy
#ln -s /opt/ddd/ccpp/gcl3/deploy/assets ${dk_gcl_bus_p}/assets
#ln -s /opt/ddd/ccpp/gcl3/deploy/nginx ${dk_gcl_bus_p}/nginx


rm -r ${dk_gcl_bus_p}/assets
rm -r ${dk_gcl_bus_p}/nginx
rm -r ${dk_gcl_bus_p}/deploy/bin_unix_d

## copy resource
#cp -r /opt/ddd/ccpp/gcl3/build/deploy ${dk_gcl_bus_p}/deploy
cp -r /opt/ddd/web/limi3/assets/projects/gcl3 ${dk_gcl_bus_p}/assets
cp -r /opt/ddd/ccpp/gcl3/deploy/nginx ${dk_gcl_bus_p}/nginx
mkdir -p ${dk_gcl_bus_p}/deploy/bin_unix_d

## copy binary
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_bus ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtdata ${dk_gcl_bus_p}/deploy/bin_unix_d/

### copy config
cp -r /opt/ddd/ccpp/gcl3/deploy/config ${dk_gcl_bus_p}/deploy/
cp -r /opt/ddd/ccpp/gcl3/deploy/gcl_sdk ${dk_gcl_bus_p}/bin_unix_d/




cat ~/../../../assets/ssh/identity.pub > ./identity.pub

docker build -t gcl3-bus-alpine1 .

docker run -d -p 2233:22 gcl3-bus-alpine1

ssh root@localhost -p 2233 # or $(docker-machine ip default)


