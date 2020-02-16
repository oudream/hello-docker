#!/bin/bash


readonly VERSION='1.0.0'

cd "$(dirname $0)"

docker build ${@} -t oudream/hello-nginx-upload:1.0.1 .
#docker build ${@} -t oudream/hello-nginx-upload:${VERSION} .
#
#docker push oudream/hello-nginx-upload:${VERSION}


#docker build -t nginx-upload:v1 . -f Dockerfile

docker run -d -p 2280:80 -p 2288:8080 --name nginx-upload oudream/hello-nginx-upload:1.0.1

open 34.66.223.113:2288

cd /opt/limi/hello-docker/hello/nginx/upload1
sFp1=$PWD/readme.md
curl  -F "file=@${sFp1};type=text/plain;filename=a1" 34.66.223.113:2280/upload

/tmp/nginx_upload/

