FROM centos:centos7

ARG MYSQL_SERVER_PACKAGE=mysql-community-server-minimal-5.7.30
ARG MYSQL_SHELL_PACKAGE=mysql-shell-8.0.20

# Install server
RUN yum install -y https://repo.mysql.com/mysql-community-minimal-release-el7.rpm \
      https://repo.mysql.com/mysql-community-release-el7.rpm \
  && yum-config-manager --enable mysql57-server-minimal \
  && yum install -y \
      $MYSQL_SERVER_PACKAGE \
      $MYSQL_SHELL_PACKAGE \
      libpwquality \
  && yum clean all \
  && mkdir /docker-entrypoint-initdb.d

VOLUME /var/lib/mysql

COPY docker-entrypoint.sh /opt/entrypoint.sh
COPY healthcheck.sh /opt/healthcheck.sh

RUN ["chmod", "777", "/opt/entrypoint.sh"]
RUN ["chmod", "777", "/opt/healthcheck.sh"]

ENTRYPOINT ["/opt/entrypoint.sh"]
HEALTHCHECK CMD /opt/healthcheck.sh

EXPOSE 3306 33060

CMD ["mysqld"]

