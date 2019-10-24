FROM ubuntu:18.0.4

## 一次性安装
RUN apt-get update -y ; sudo apt-get upgrade -y && \
    apt-get install -y apt-utils wget openssh-server telnet vim passwd ifstat unzip iftop htop telnet \
    samba net-tools lsof rsync gcc g++ cmake build-essential gdb gdbserver \
    unixodbc unixodbc-dev libcurl4-openssl-dev uuid uuid-dev \
    qt5-default libqt5svg5 libqt5svg5-dev qtcreator

RUN apt update \
    && apt install -y firefox \
                      openssh-server \
                      xauth \
                      x11-apps \
    && mkdir /var/run/sshd \
    && mkdir /root/.ssh \
    && chmod 700 /root/.ssh \
    && ssh-keygen -A \
    && sed -i "s/^.*PasswordAuthentication.*$/PasswordAuthentication no/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11Forwarding.*$/X11Forwarding yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11UseLocalhost.*$/X11UseLocalhost no/" /etc/ssh/sshd_config \
    && grep "^X11UseLocalhost" /etc/ssh/sshd_config || echo "X11UseLocalhost no" >> /etc/ssh/sshd_config

RUN echo "YOUR_PUB_KEY_HERE" >> /root/.ssh/authorized_keys

ENTRYPOINT ["sh", "-c", "/usr/sbin/sshd && tail -f /dev/null"]