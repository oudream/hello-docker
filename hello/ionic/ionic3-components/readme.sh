#!/usr/bin/env bash

#docker build --no-cache -t ionic3-android-builder .
docker build -t oudream/ionic3-android-ubuntu:1.0.1 .

docker login
docker push oudream/ionic3-android-ubuntu:1.0.1

docker run -it oudream/ionic3-android-ubuntu:1.0.1 /bin/bash

git clone https://github.com/yannbf/ionic3-components.git

ionic cordova platform add android
