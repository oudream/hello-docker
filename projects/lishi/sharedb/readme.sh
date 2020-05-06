#!/usr/bin/env bash


GCL3_MYSQL_PASSWORD=123456


cd /opt/limi/hello-docker
git pull origin master
sed -i "s/123456/${GCL3_MYSQL_PASSWORD}/g" ./projects/lishi/sharedb/master.json
# build
node ./projects/lishi/sharedb/main-build.js
# cp
#    rm -r ./projects/lishi/sharedb/vue-admin
#    mkdir ./projects/lishi/sharedb/vue-admin
#    cp ./projects/lishi/sharedb/dist/index.html ./projects/lishi/sharedb/index.html
#    cp -r ./projects/lishi/sharedb/dist/static ./projects/lishi/sharedb/vue-admin/
# run
node ./projects/lishi/sharedb/main-run.js


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
sed -i "s/123456/${GCL3_MYSQL_PASSWORD}/g" ./projects/lishi/sharedb/master.json
sed -i "s/db1/db2/g" ./projects/lishi/sharedb/master.json


# note note note
npm i sqlite3 node-sass --unsafe-perm
npm i


### mysql password.sh

# create table
node ./projects/lishi/sharedb/main-db-init.js

# debug
node ./projects/lishi/sharedb/main-debug.js

# open browser
open http://localhost:2292
# open http://localhost:2292/hello-docker/projects/lishi/sharedb/dist
# upload
cd /opt/limi/hello-docker/hello/nginx/upload1
sFp1=$PWD/readme.md
curl  -F "file=@${sFp1};type=text/plain;filename=a1" 122.51.12.151:2232/upload


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


### modify db
# UPDATE Vehicle SET BeginDT='-62164540800000' WHERE BeginDT='----';
# UPDATE Vehicle SET EndDT='-62164540800000' WHERE EndDT='----';
#    UPDATE Vehicle SET EndDT='-62164540800000' WHERE EndDT='----';
#
#    UPDATE Vehicle SET BeginDT=0 WHERE BeginDT='-62164540800000';
#
#    UPDATE Vehicle SET EndDT='0' WHERE EndDT='';
#
#    SELECT * FROM Vehicle WHERE EndDT='-'
#
#    SELECT * FROM Vehicle WHERE EndDT=''
#
#    SELECT * FROM Vehicle WHERE IS_NUMERIC(BeginDT)
#
#    SELECT * FROM Vehicle WHERE concat('',EndDT * 1) != EndDT
#
#    UPDATE Vehicle, Man SET Vehicle.ManID = Man.ManID WHERE Vehicle.ManName = Man.ManName

