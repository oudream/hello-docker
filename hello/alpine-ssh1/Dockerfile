FROM alpine

ARG ssh_pub_key

RUN apk update && \
    apk upgrade

RUN apk add --no-cache openssh \
  && sed -i s/#PermitRootLogin.*/PermitRootLogin\ yes/ /etc/ssh/sshd_config \
  && passwd -d root \
  && echo "$ssh_pub_key" > /root/.ssh/authorized_keys

ENTRYPOINT ["sh", "-c", "/usr/sbin/sshd && tail -f /dev/null"]

CMD exec /usr/sbin/sshd -D -e "$@"