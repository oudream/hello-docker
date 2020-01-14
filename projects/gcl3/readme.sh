#!/usr/bin/env bash

# cmake . -G "Xcode" --build "/ddd/communication/protobuf/protobuf/cmake" -B"/ddd/communication/protobuf/protobuf/cmake-xcode"

#gcl_deploy_p=/opt/ddd/ccpp/gcl3/build/deploy

## delete config
rm -r /opt/ddd/ccpp/gcl3/build/deploy/business
rm -r /opt/ddd/ccpp/gcl3/build/deploy/config
rm -r /opt/ddd/ccpp/gcl3/build/deploy/data
rm -r /opt/ddd/ccpp/gcl3/build/deploy/db
rm -r /opt/ddd/ccpp/gcl3/build/deploy/describe
rm -r /opt/ddd/ccpp/gcl3/build/deploy/log
rm -r /opt/ddd/ccpp/gcl3/build/deploy/measure
rm -r /opt/ddd/ccpp/gcl3/build/deploy/model
rm -r /opt/ddd/ccpp/gcl3/build/deploy/report
rm -r /opt/ddd/ccpp/gcl3/build/deploy/script
rm -r /opt/ddd/ccpp/gcl3/build/deploy/temp
rm -r /opt/ddd/ccpp/gcl3/build/deploy/terminal
rm -r /opt/ddd/ccpp/gcl3/build/deploy/ui
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_sdk

## git update
cd /opt/ddd/ccpp/ccxx && \
git reset --hard origin/master && \
git pull origin master && \
cd /opt/ddd/ccpp/gcl3 && \
git reset --hard origin/master && \
git pull origin master && \
cd /opt/ddd/web/limi3 && \
git reset --hard origin/master && \
git pull origin master

## build clear
rm -r /opt/ddd/ccpp/gcl3/build/cmake-gcc && \
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/*
## build make
cmake . -DCMAKE_BUILD_TYPE=Debug --build "/opt/ddd/ccpp/gcl3/build/cmake" -B"/opt/ddd/ccpp/gcl3/build/cmake-gcc" && \
cd /opt/ddd/ccpp/gcl3/build/cmake-gcc && make

## copy config
cp -r /opt/ddd/ccpp/gcl3/deploy/config /opt/ddd/ccpp/gcl3/build/deploy/
cp -r /opt/ddd/ccpp/gcl3/deploy/gcl_sdk /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/

### delete all binary buf [ gcl_svr_bus liblibccxx.so gcl_svr_fastcgi_rtdata ]
arr1=$(find . -type f)
for a in ${arr1[@]};do [[ ${a} =~ '_d/gcl_svr_bus' || ${a} =~ '_d/liblibccxx.so' || ${a} =~ '_d/gcl_svr_fastcgi_rtdata' ]] && (echo "null ${a}") || (echo "rm ${a}" `rm ${a}` ) ; done
for a in ${arr1[@]};do [[ ${a} =~ gcl_svr_bus$ || ${a} =~ liblibccxx.so || ${a} =~ gcl_svr_fastcgi_rtdata$ ]] && (echo "null ${a}") || (echo "rm ${a}" `rm ${a}`) ; done


### run
cd /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d

/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_bus
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_sdk_tool
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_bus_viewer
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtdata


/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_database
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_filesystem
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtdata
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtlog

/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_bus &
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_sdk_tool &
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_bus_viewer &
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtdata &

nginx -c /opt/ddd/ccpp/gcl3/deploy/nginx/nginx.conf

http://localhost:8821/bus/


rm /opt/ddd/ccpp/gcl3/build/deploy

#gcl_bus_viewer                 gcl_svr_fastcgi_filesystem     libgcl_lua_vdi.so              vxd_frame
#gcl_sdk                        gcl_svr_fastcgi_rtdata         libgcl_sdk.so                  vxd_iec104
#gcl_sdk_main                   gcl_svr_fastcgi_rtlog          libgcl_vdi.so                  vxd_modbus_rtu
#gcl_sdk_tool                   gcl_svr_rtdbs                  liblibccxx.so                  vxd_modbus_tcp
#gcl_svr_bus                    gcl_svr_script_vxd             liblibccxx_database_odbc.so
#gcl_svr_fastcgi_database       libgcl_lua_ccxx.so             liblibccxx_database_sqlite.so


arr1=$(find . -type f)
for a in ${arr1[@]};do [[ ${a} =~ '_d/gcl_svr_bus' || ${a} =~ '_d/liblibccxx.so' || ${a} =~ '_d/gcl_svr_fastcgi_rtdata' ]] && (echo "null ${a}") || (echo "rm ${a}" `rm ${a}` ) ; done
for a in ${arr1[@]};do [[ ${a} =~ gcl_svr_bus$ || ${a} =~ liblibccxx.so || ${a} =~ gcl_svr_fastcgi_rtdata$ ]] && (echo "null ${a}") || (echo "rm ${a}" `rm ${a}`) ; done


# clion
# error,msg="Error while executing Python code.
#sys.path.insert(0, "/Applications/CLion.app/Contents/bin/gdb/renderers");
#from default.printers import register_default_printers;
#register_default_printers(None);
#from default.libstdcxx_printers import patch_libstdcxx_printers_module;
#patch_libstdcxx_printers_module();
#from libstdcxx.v6.printers import register_libstdcxx_printers;
#register_libstdcxx_printers(None);
mkdir -p /Applications/CLion.app/Contents/bin/gdb/renderers
scp -P 2201 -r /Applications/CLion.app/Contents/bin/gdb/renderers root@localhost:/Applications/CLion.app/Contents/bin/gdb/renderers
#
echo "alias python=python3" >> ~/.bashrc

limi.135246

