FROM oudream/gcl3-nginx-alpine:1.0.2

LABEL maintainer="oudream - https://github.com/oudream"

ENTRYPOINT ["/opt/entrypoint.sh"]

EXPOSE 22 8821

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
    apk add libuuid

COPY deploy /opt/ddd/ccpp/gcl3/build/deploy
COPY assets /opt/ddd/ccpp/gcl3/deploy/assets
COPY nginx_gcl3.conf /etc/nginx/conf.d/nginx_gcl3.conf
