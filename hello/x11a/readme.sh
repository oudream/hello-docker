#!/usr/bin/env bash

# Basic container for X11 forwarding goodness
# https://gist.github.com/udkyo/c20935c7577c71d634f0090ef6fa8393

# 1 : at vps
docker build -t firefox .
# 2 : at vps
docker run -it --rm -p 2201:22 firefox
# 3 : at pc [ local ]
ssh -AXY -p 2201 root@${vps_ip}



### readme
To get up and running, build it, then:

docker run -it --rm -p 2150:22 firefox

Add this to ~/.ssh/config on the client

Host abc
     Hostname HOST_NAME_HERE
     Port 2201
     user root
     ForwardX11 yes
     ForwardX11Trusted yes
Connect from client with:

ssh -X root@abc firefox


docker build -t firefox .

docker run -it --rm -p 2201:22 $ImageId
#docker run -it --rm -p 2201:22 firefox
docker run -d x11a

docker exec -e DISPLAY=$DISPLAY -it 05201d90750e /bin/sh


### Dockerfile use password
### --- begin --- :
FROM ubuntu
RUN apt update \
    && apt install -y firefox \
                      openssh-server \
                      xauth \
                      x11-apps \
    && mkdir /var/run/sshd \
    && mkdir /root/.ssh \
    && chmod 700 /root/.ssh \
    && ssh-keygen -A \
    && sed -i "s/^.*PasswordAuthentication.*$/PasswordAuthentication yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*PermitEmptyPasswords.*$/PermitEmptyPasswords yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*PermitRootLogin.*$/PasswordAuthentication yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11Forwarding.*$/X11Forwarding yes/" /etc/ssh/sshd_config \
    && sed -i "s/^.*X11UseLocalhost.*$/X11UseLocalhost no/" /etc/ssh/sshd_config \
    && grep "^X11UseLocalhost" /etc/ssh/sshd_config || echo "X11UseLocalhost no" >> /etc/ssh/sshd_config

### --- notice notice notice ---
#RUN echo "YOUR_PUB_KEY_HERE" >> /root/.ssh/authorized_keys
#RUN echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6x8pcWLtU0Oj/iZaps8gUSGnGQPI22tyFKEQ7yczQOpZkBvp+nnYi3pGeRRlJTG+Shyw6wgT4fwLUJ0/HkzOyGbTPPPSLGJZpiNDNo8ULmSJjtwX1odBeJxskxTHbVaGIRTTAzd5JmAnYBes2F/n6TfNW2ZoZaAh7R+ToX2e/JgniU8Bg39p+XJYdyb3d5EBnT7HjlKdohQwILCeSUemgVr2inxAYnFWMo62dIouYbEFPjR0mL69u/qxoIhBWEyE0Su7yg21pRZkMt4a5Yayk0p/GJYIWbHM9HlOzptuGHe/7uvOojxA9A2EmTwCX7WySPsMt9hibLlQ6le8ffeU7 oudream@bogon" >> /root/.ssh/authorized_keys

ENTRYPOINT ["sh", "-c", "/usr/sbin/sshd && tail -f /dev/null"]
### --- end --- .
