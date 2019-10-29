FROM gcl3-alpine-dev:latest

RUN apk update && \
    apk upgrade

ADD $HOME/.ssh/id_rsa.pub /root/.ssh/authorized_keys


RUN apk add openssh openssh-server openssh-keygen xauth \
            xclock \
    && mkdir /var/run/sshd \
    && mkdir /root/.ssh \
    && chmod 700 /root/.ssh \
    && ssh-keygen -A \
    && sed -i "s/^#PasswordAuthentication.*$/PasswordAuthentication no/" /etc/ssh/sshd_config \
    && sed -i "s/^#PermitRootLogin.*$/PermitRootLogin yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11Forwarding.*$/X11Forwarding yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11UseLocalhost.*$/X11UseLocalhost no/" /etc/ssh/sshd_config \
    && grep "^X11UseLocalhost" /etc/ssh/sshd_config || echo "X11UseLocalhost no" >> /etc/ssh/sshd_config \
    && touch /root/.Xauthority \
    && chmod 600 /root/.Xauthority \
    && chmod 600 /root/.ssh/authorized_keys \


### --- notice notice notice ---
#RUN echo "YOUR_PUB_KEY_HERE" >> /root/.ssh/authorized_keys
#
ENTRYPOINT ["sh", "-c", "/usr/sbin/sshd && tail -f /dev/null"]