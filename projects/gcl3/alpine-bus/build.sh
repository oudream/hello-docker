#!/usr/bin/env bash

dk_gcl_bus_p=/opt/limi/hello-docker/projects/gcl3/alpine-bus

rm -r ${dk_gcl_bus_p}/assets
rm -r ${dk_gcl_bus_p}/deploy/bin_unix_d
rm ./identity.pub

cat ./../../../assets/ssh/identity.pub > ./identity.pub

cp -r /opt/ddd/web/limi3/assets/projects/gcl3 ${dk_gcl_bus_p}/assets

mkdir -p ${dk_gcl_bus_p}/deploy/bin_unix_d

cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/liblibccxx.so ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/liblibccxx_database_sqlite.so ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_bus ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtdata ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_filesystem ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtlog ${dk_gcl_bus_p}/deploy/bin_unix_d/
cp /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_rtdbs ${dk_gcl_bus_p}/deploy/bin_unix_d/

cp -r /opt/ddd/ccpp/gcl3/deploy/config ${dk_gcl_bus_p}/deploy/
