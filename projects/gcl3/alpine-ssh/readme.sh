#!/usr/bin/env bash

docker build -t gcl3-alpine-ssh .

docker run -d -v /opt/ddd:/opt/ddd --entrypoint="" -p 2202:22 gcl3-alpine-ssh tail -f /dev/null
docker run -d -v /opt/ddd:/opt/ddd -p 2202:22 gcl3-alpine-ssh

ssh -AXY -p 2202 root@35.239.31.154
ssh -AXY -p 2202 root@localhost

/usr/sbin/sshd >>/root/sshd_out.txt 2>>/root/sshd_err.txt
PermitEmptyPasswords yes
PasswordAuthentication yes


docker run -d --rm --publish=2223:22 sickp/alpine-sshd-auth
ssh root@localhost -p 2223