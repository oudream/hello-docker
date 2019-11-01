#!/usr/bin/env bash


### build
cmake . -DCMAKE_BUILD_TYPE=Debug --build "/opt/ddd/ccpp/gcl3/build/cmake" -B"/opt/ddd/ccpp/gcl3/build/cmake-gcc"
# cmake . -G "Xcode" --build "/ddd/communication/protobuf/protobuf/cmake" -B"/ddd/communication/protobuf/protobuf/cmake-xcode"

cd /opt/ddd/ccpp/gcl3/build/cmake-gcc && make



### run
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/business
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/config
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/data
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/db
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/describe
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/log
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/measure
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/model
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/report
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/script
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/temp
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/terminal
rm -r /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/ui

cp -r /opt/ddd/ccpp/gcl3/deploy/config /opt/ddd/ccpp/gcl3/build/deploy/
cp -r /opt/ddd/ccpp/gcl3/deploy/gcl_sdk /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/


cd /opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d

/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_bus
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_sdk_tool
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_bus_viewer
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtdata

/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_bus &
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_sdk_tool &
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_bus_viewer &
/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtdata &

cp -r /opt/ddd/ccpp/gcl3/deploy/assets /opt/fff/gcl3.1.1/

nginx -c /opt/fff/nginx/nginx.conf

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

