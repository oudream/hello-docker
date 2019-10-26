FROM alpine

## 一次性安装
RUN apk upgrade && \
    apk update && \
    apk add --update alpine-sdk && \
    apk add cmake git gdb vim unixodbc-dev unixodbc libuuid && \
    apk add libffi-dev openssl-dev && \
    apk add nodejs && \
    apk add python3 && \
    apk add qt5-qtbase-dev qt5-qtsvg-dev && \
    apk add qt5-qtbase qt5-qtsvg

RUN apk add openssh-server openssh-keygen xauth\
            xclock \
    && mkdir /var/run/sshd \
    && mkdir /root/.ssh \
    && chmod 700 /root/.ssh \
    && ssh-keygen -A \
    && sed -i "s/^#PasswordAuthentication.*$/PasswordAuthentication no/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11Forwarding.*$/X11Forwarding yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11UseLocalhost.*$/X11UseLocalhost no/" /etc/ssh/sshd_config \
    && grep "^X11UseLocalhost" /etc/ssh/sshd_config || echo "X11UseLocalhost no" >> /etc/ssh/sshd_config

### --- notice notice notice ---
#RUN echo "YOUR_PUB_KEY_HERE" >> /root/.ssh/authorized_keys
#
RUN echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6x8pcWLtU0Oj/iZaps8gUSGnGQPI22tyFKEQ7yczQOpZkBvp+nnYi3pGeRRlJTG+Shyw6wgT4fwLUJ0/HkzOyGbTPPPSLGJZpiNDNo8ULmSJjtwX1odBeJxskxTHbVaGIRTTAzd5JmAnYBes2F/n6TfNW2ZoZaAh7R+ToX2e/JgniU8Bg39p+XJYdyb3d5EBnT7HjlKdohQwILCeSUemgVr2inxAYnFWMo62dIouYbEFPjR0mL69u/qxoIhBWEyE0Su7yg21pRZkMt4a5Yayk0p/GJYIWbHM9HlOzptuGHe/7uvOojxA9A2EmTwCX7WySPsMt9hibLlQ6le8ffeU7 oudream@bogon" >> /root/.ssh/authorized_keys

ENTRYPOINT ["sh", "-c", "/usr/sbin/sshd && tail -f /dev/null"]