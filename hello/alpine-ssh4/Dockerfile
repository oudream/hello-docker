FROM alpine:3.9

LABEL maintainer "Adrian B. Danieli - https://github.com/sickp"

EXPOSE 22

RUN apk add --no-cache openssh \
  && sed -i s/#PermitRootLogin.*/PermitRootLogin\ yes/ /etc/ssh/sshd_config \
  && echo "root:root" | chpasswd

COPY identity.pub /root/.ssh/authorized_keys

RUN passwd -d root && \
    ssh-keygen -A

CMD exec /usr/sbin/sshd -D -e "$@"
