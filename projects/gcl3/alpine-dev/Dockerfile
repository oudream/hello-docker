FROM alpine

## 一次性安装
RUN apk upgrade && \
    apk update && \
    apk add --update alpine-sdk && \
    apk add cmake git gdb vim unixodbc-dev unixodbc libuuid && \
    apk add libffi-dev openssl-dev && \
    apk add nodejs && \
    apk add python3 && \
    apk add qt5-qtbase-dev qt5-qtsvg-dev && \
    apk add qt5-qtbase qt5-qtsvg
