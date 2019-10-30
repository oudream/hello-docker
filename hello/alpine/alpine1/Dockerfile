FROM alpine

RUN apk add --update alpine-sdk \
    apk add libffi-dev openssl-dev \
    apk add cmake git openssh-server vim gdb gdbserver \
    apk add unixodbc-dev uuid-dev \
    apk add unixodbc uuid

ENTRYPOINT ["tail -f /dev/null"]