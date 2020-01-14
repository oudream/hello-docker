FROM ubuntu:bionic

LABEL maintainer=oudream@github.com

RUN apt-get update -y ; apt-get upgrade -y && \
    apt-get install apt-utils wget openssh-server telnet vim passwd ifstat unzip iftop telnet samba net-tools lsof rsync gcc g++ cmake build-essential gdb gdbserver -y && \
    rm -rf /var/lib/apt/lists/*

RUN ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key -N '' -y && \
    sed -i 's/#PermitRootLogin without-password/PermitRootLogin yes/g' /etc/ssh/sshd_config && \
    sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/g' /etc/ssh/sshd_config && \
    echo 'root:135246' | chpasswd

#RUN echo 'export LANG=C' >> /etc/profile
#ADD . /code

#WORKDIR /code

# Taken from - https://docs.docker.com/engine/examples/running_ssh_service/#environment-variables

# SSH login fix. Otherwise user is kicked off after login

#ENV NOTVISIBLE "in users profile"

# 22 for ssh server. 7777 for gdb server.
EXPOSE 22 7777

#RUN useradd -ms /bin/bash debugger
#RUN echo 'debugger:pwd' | chpasswd

CMD ["/usr/sbin/sshd", "-D"]
