#!/usr/bin/env bash


GCL3_MYSQL_PASSWORD=123456


cd /opt/limi/hello-docker
git pull origin master
sed -i "s/123456/${GCL3_MYSQL_PASSWORD}/g" ./projects/gcl3/master/master.json
# build
node ./projects/gcl3/master/main-build.js
# cp
#    rm -r ./projects/gcl3/master/vue-admin
#    mkdir ./projects/gcl3/master/vue-admin
#    cp ./projects/gcl3/master/dist/index.html ./projects/gcl3/master/index.html
#    cp -r ./projects/gcl3/master/dist/static ./projects/gcl3/master/vue-admin/
# run
node ./projects/gcl3/master/main-run.js


### ----------------------------------------------------------------------------------------------


### install node
sudo apt update
sudo apt install nodejs
# or 或者
NODE_VERSION=v12.16.0
NODE_DISTRO=linux-x64
wget https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz
sudo mkdir -p /usr/local/lib/nodejs
sudo tar -xJvf node-${NODE_VERSION}-${NODE_DISTRO}.tar.xz -C /usr/local/lib/nodejs

sed -i "$ a export PATH=/usr/local/lib/nodejs/node-${NODE_VERSION}-${NODE_DISTRO}/bin:"'$PATH' ~/.profile


### install mysql-server
sudo apt update
sudo apt install mysql-server


### git clone
git clone https://github.com/oudream/hello-docker.git
sed -i "s/123456/${GCL3_MYSQL_PASSWORD}/g" ./projects/gcl3/master/master.json
sed -i "s/db1/db2/g" ./projects/gcl3/master/master.json


# note note note
npm i sqlite3 node-sass --unsafe-perm
npm i


### mysql password.sh

# create table
node ./projects/gcl3/master/main-db-init.js

# debug
node ./projects/gcl3/master/main-debug.js

# open browser
open http://localhost:2292
# open http://localhost:2292/hello-docker/projects/gcl3/master/dist

# backup
#    mysql
#    # mysql>
#        create database db1;
#        INSERT INTO `user`(`id`, `name`, `password`) VALUES ('1','admin','admin');
#        exit
#
#    INSERT INTO `db1`.`bureau`(`id`, `name`, `phone`, `email`, `addr`, `remark`) VALUES (3, '香洲局', '88843121', NULL, '人民西路XXX 号，香洲局', NULL);
#    INSERT INTO `db1`.`bureau`(`id`, `name`, `phone`, `email`, `addr`, `remark`) VALUES (4, '唐家局', '8884322', 'xxx2@xxx.com', '人民西路XXX号，2', '备注的枯要，备注备注');
#    INSERT INTO `db1`.`bureau`(`id`, `name`, `phone`, `email`, `addr`, `remark`) VALUES (5, '金湾局', '8884323', '3@xxx.com', '人民西路3号', NULL);
#    INSERT INTO `db1`.`bureau`(`id`, `name`, `phone`, `email`, `addr`, `remark`) VALUES (6, '斗门局', '8884324', '4@xxx.com', '人民西路4号', NULL);
#    INSERT INTO `db1`.`bureau`(`id`, `name`, `phone`, `email`, `addr`, `remark`) VALUES (7, '金鼎局', '8884325', '5@xxx.com', '保可可国国是是另国', '村沙发舒服');
