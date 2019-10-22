#!/usr/bin/env bash

# docker logs显示的是容器内部运行输出到控制台的信息


### docker logs为何没有日志输出？
#spring boot应用使用docker容器启动后，使用docker logs没有日志输出，docker attach 到容器可以看到日志
#启动命令如下：
docker run -d -t -v app.jar:/app.jar -p 8080 docker.io/java:openjdk-8u111-jre-alpine java -jar /app.jar
# 有大神可以解释一下吗？看了一些docker logs的博文，但都没有找到合适的解决办法

RUN ln -sf /dev/stdout /var/log/some-log.log
