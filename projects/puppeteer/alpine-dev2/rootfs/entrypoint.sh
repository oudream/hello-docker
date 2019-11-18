#!/bin/ash

#
node /opt/hello-world.js

# do not detach (-D), log to stderr (-e), passthrough other arguments
exec /usr/sbin/sshd -D -e "$@"
