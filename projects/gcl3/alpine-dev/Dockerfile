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

RUN apk add xauth \
            xclock \
    && sed -i "s/^.*X11Forwarding.*$/X11Forwarding yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11UseLocalhost.*$/X11UseLocalhost no/" /etc/ssh/sshd_config \
    && grep "^X11UseLocalhost" /etc/ssh/sshd_config || echo "X11UseLocalhost no" >> /etc/ssh/sshd_config \
    && touch /root/.Xauthority \
    && chmod 600 /root/.Xauthority

RUN apk add --update alpine-sdk && \
    apk add cmake git gdb rsync vim screen unixodbc-dev unixodbc libuuid && \
    apk add libffi-dev openssl-dev && \
    apk add nodejs && \
    apk add python3 && \
    apk add qt5-qtbase-dev qt5-qtsvg-dev && \
    apk add qt5-qtbase qt5-qtsvg
