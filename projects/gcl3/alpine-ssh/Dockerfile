FROM gcl3-alpine-dev:latest

RUN apk update && \
    apk upgrade

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
    && touch /root/sshd_out.txt \
    && touch /root/sshd_err.txt \
    && chmod 700 /root/sshd_out.txt \
    && chmod 700 /root/sshd_out.txt

### --- notice notice notice ---
#RUN echo "YOUR_PUB_KEY_HERE" >> /root/.ssh/authorized_keys
#
RUN echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6x8pcWLtU0Oj/iZaps8gUSGnGQPI22tyFKEQ7yczQOpZkBvp+nnYi3pGeRRlJTG+Shyw6wgT4fwLUJ0/HkzOyGbTPPPSLGJZpiNDNo8ULmSJjtwX1odBeJxskxTHbVaGIRTTAzd5JmAnYBes2F/n6TfNW2ZoZaAh7R+ToX2e/JgniU8Bg39p+XJYdyb3d5EBnT7HjlKdohQwILCeSUemgVr2inxAYnFWMo62dIouYbEFPjR0mL69u/qxoIhBWEyE0Su7yg21pRZkMt4a5Yayk0p/GJYIWbHM9HlOzptuGHe/7uvOojxA9A2EmTwCX7WySPsMt9hibLlQ6le8ffeU7 oudream@bogon" >> /root/.ssh/authorized_keys

ENTRYPOINT ["sh", "-c", "/usr/sbin/sshd >>/root/sshd_out.txt 2>>/root/sshd_err.txt && tail -f /dev/null"]