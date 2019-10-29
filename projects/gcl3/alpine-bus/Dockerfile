FROM alpine

## 一次性安装
RUN apk upgrade && \
    apk update && \
    apk add nginx libuuid

ENTRYPOINT ["sh", "-c", "/usr/sbin/sshd >>/root/sshd_out.txt 2>>/root/sshd_err.txt && tail -f /dev/null"]