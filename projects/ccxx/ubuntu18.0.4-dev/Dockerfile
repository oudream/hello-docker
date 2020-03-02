FROM ubuntu:18.04


RUN echo "deb http://security.ubuntu.com/ubuntu xenial-security main" | tee /etc/apt/sources.list.d/libjasper.list && \
    apt update -y ; apt upgrade -y && \
    apt install -y gcc g++ cmake build-essential gdb gdbserver git \
        unixodbc unixodbc-dev libcurl4-openssl-dev uuid uuid-dev \
        qt5-default libqt5svg5 libqt5svg5-dev qtcreator \
        software-properties-common \
        libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev \
        python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev

RUN cd opt && \
    git clone https://github.com/opencv/opencv.git && \
    git reset --hard 4c71dbf && \
    cd opt/opencv && mkdir build && cd build && \
    cmake -D CMAKE_BUILD_TYPE=Release -D CMAKE_INSTALL_PREFIX=/usr/local .. && \
    make -j7 && make install && \
    rm -r opt/opencv

RUN apt update \
    && apt install -y openssh-server \
                      xauth \
                      x11-apps \
    && mkdir /var/run/sshd \
    && mkdir /root/.ssh \
    && chmod 755 /root/.ssh \
    && ssh-keygen -A \
    && sed -i "s/^.*PasswordAuthentication.*$/PasswordAuthentication yes/" /etc/ssh/sshd_config \
    && sed -i "s/^#PermitRootLogin.*$/PermitRootLogin yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11Forwarding.*$/X11Forwarding yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11UseLocalhost.*$/X11UseLocalhost no/" /etc/ssh/sshd_config \
    && grep "^X11UseLocalhost" /etc/ssh/sshd_config || echo "X11UseLocalhost no" >> /etc/ssh/sshd_config \
    && rm -rf /var/lib/apt/lists/*

RUN echo "root:12345" | chpasswd

ENTRYPOINT ["sh", "-c", "/usr/sbin/sshd && tail -f /dev/null"]
