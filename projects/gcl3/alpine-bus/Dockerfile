FROM alpine:3.10

LABEL maintainer="oudream - https://github.com/oudream"

ENTRYPOINT ["/opt/entrypoint.sh"]

EXPOSE 22

COPY rootfs /opt/

RUN apk update && \
    apk upgrade

RUN apk add --no-cache openssh \
  && sed -i s/#PermitRootLogin.*/PermitRootLogin\ yes/ /etc/ssh/sshd_config \
  && echo "root:root" | chpasswd \
  && passwd -d root \
  && ssh-keygen -A

COPY identity.pub /root/.ssh/authorized_keys

RUN apk add nginx libuuid
