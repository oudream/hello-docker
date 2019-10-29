FROM alpine

RUN apk update && \
    apk upgrade

RUN apk add --no-cache openssh \
    && sed -i s/#PermitRootLogin.*/PermitRootLogin\ yes/ /etc/ssh/sshd_config \
    && echo "root:root" | chpasswd \
    && passwd -d root \
    && ssh-keygen -A

COPY identity.pub /root/.ssh/authorized_keys

CMD exec /usr/sbin/sshd -D -e "$@"
