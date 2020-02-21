#!/usr/bin/env bash

#docker build --no-cache -t ionic3-components-builder .
docker build -t oudream/ionic3-components-ubuntu:1.0.1 .

docker login
docker push oudream/ionic3-components-ubuntu:1.0.1

docker run -it oudream/ionic3-components-ubuntu:1.0.1 /bin/bash

git clone https://github.com/yannbf/ionic3-components.git

ionic cordova platform add android

    ionic cordova platform add android -y
    ionic cordova resources android-y
    ionic cordova resources -f
    ionic cordova build android -y
