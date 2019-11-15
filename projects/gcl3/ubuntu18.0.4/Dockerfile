FROM ubuntu

## 一次性安装
RUN apt-get update -y ; apt-get upgrade -y && \
    apt-get install -y apt-utils wget openssh-server telnet screen vim passwd ifstat unzip iftop htop git \
    samba net-tools lsof rsync gcc g++ autoconf cmake build-essential gdb gdbserver \
    libncurses5-dev unixodbc unixodbc-dev libcurl4-openssl-dev uuid uuid-dev libssl-dev \
    qt5-default libqt5svg5 libqt5svg5-dev nginx python3 python3-dev nodejs

RUN apt update \
    && apt install -y openssh-server \
                      xauth \
                      x11-apps \
    && mkdir /var/run/sshd \
    && mkdir /root/.ssh \
    && chmod 755 /root/.ssh \
    && ssh-keygen -A \
    && sed -i "s/^.*PasswordAuthentication.*$/PasswordAuthentication no/" /etc/ssh/sshd_config \
    && sed -i "s/^#PermitRootLogin.*$/PermitRootLogin yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11Forwarding.*$/X11Forwarding yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11UseLocalhost.*$/X11UseLocalhost no/" /etc/ssh/sshd_config \
    && grep "^X11UseLocalhost" /etc/ssh/sshd_config || echo "X11UseLocalhost no" >> /etc/ssh/sshd_config

### --- notice notice notice ---
#RUN echo "YOUR_PUB_KEY_HERE" >> /root/.ssh/authorized_keys
#
RUN echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6x8pcWLtU0Oj/iZaps8gUSGnGQPI22tyFKEQ7yczQOpZkBvp+nnYi3pGeRRlJTG+Shyw6wgT4fwLUJ0/HkzOyGbTPPPSLGJZpiNDNo8ULmSJjtwX1odBeJxskxTHbVaGIRTTAzd5JmAnYBes2F/n6TfNW2ZoZaAh7R+ToX2e/JgniU8Bg39p+XJYdyb3d5EBnT7HjlKdohQwILCeSUemgVr2inxAYnFWMo62dIouYbEFPjR0mL69u/qxoIhBWEyE0Su7yg21pRZkMt4a5Yayk0p/GJYIWbHM9HlOzptuGHe/7uvOojxA9A2EmTwCX7WySPsMt9hibLlQ6le8ffeU7 oudream@bogon" >> /root/.ssh/authorized_keys

ENTRYPOINT ["sh", "-c", "/usr/sbin/sshd && tail -f /dev/null"]
