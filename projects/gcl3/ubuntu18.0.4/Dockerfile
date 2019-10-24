FROM ubuntu:18.0.4

## 一次性安装
RUN sudo apt-get update -y ; sudo apt-get upgrade -y && \
    sudo apt-get install apt-utils wget openssh-server telnet vim passwd ifstat unzip iftop htop telnet \
    samba net-tools lsof rsync gcc g++ cmake build-essential gdb gdbserver \
    unixodbc unixodbc-dev libcurl4-openssl-dev uuid uuid-dev \
    qt5-default libqt5svg5 libqt5svg5-dev qtcreator -y && \
    sudo rm -rf /var/lib/apt/lists/*
