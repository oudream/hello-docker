#!/bin/ash

# do not detach (-D), log to stderr (-e), passthrough other arguments
/usr/sbin/sshd -e "$@"

nginx -c /opt/ddd/ccpp/gcl3/deploy/nginx/nginx.conf

/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_bus &

/opt/ddd/ccpp/gcl3/build/deploy/bin_unix_d/gcl_svr_fastcgi_rtdata
