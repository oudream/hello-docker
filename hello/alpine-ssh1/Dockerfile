FROM alpine

ARG ssh_pub_key

RUN apk update && \
    apk upgrade

RUN apk add --no-cache openssh \
    && sed -i s/#PermitRootLogin.*/PermitRootLogin\ yes/ /etc/ssh/sshd_config \
    && echo "root:root" | chpasswd \
    && passwd -d root \
    && mkdir /root/.ssh \
    && chmod 731 /root/.ssh \
    && ssh-keygen -A
    && touch /root/.ssh/authorized_keys \
    && chmod 600 /root/.ssh/authorized_keys \
    && echo "$ssh_pub_key" > /root/.ssh/authorized_keys \

CMD exec /usr/sbin/sshd -D -e "$@"

#drwxr-xr-x    2 root     root          4096 Oct 29 11:33 .ssh