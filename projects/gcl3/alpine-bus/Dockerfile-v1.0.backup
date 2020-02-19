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

RUN apk add --update alpine-sdk && \
    apk add nginx libuuid && \
    mkdir -p /run/nginx

COPY deploy /opt/ddd/ccpp/gcl3/build/deploy
COPY assets /opt/ddd/ccpp/gcl3/deploy/assets
COPY nginx /opt/ddd/ccpp/gcl3/deploy/nginx

