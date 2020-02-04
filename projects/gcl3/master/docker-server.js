let fs = require('fs');
let Docker = require('dockerode');

let DockerServer = function() {
    let socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
    let stats = fs.statSync(socket);

    if (!stats.isSocket()) {
        throw new Error('Are you sure the docker is running?');
    }

    this.docker = new Docker({
        socketPath: '/var/run/docker.sock',
        // timeout: 100
    });

// you may specify a timeout (in ms) for all operations, allowing to make sure you don't fall into limbo if something happens in docker
// this.docker = new Docker({host: 'http://127.0.0.1', port: 2375, timeout: 100});

    this.configContainers = [];

    /**
     [
     {
    Id: '9debfec99555264a992a9a9aaf658a9c3d897da667ffc0f90671fc987a695daa',
    Names: [ '/brave_mccarthy' ],
    Image: 'alpine',
    ImageID: 'sha256:cc0abc535e36a7ede71978ba2bbd8159b8a5420b91f2fbc520cdf5f673640a34',
    Command: "/bin/sh -c 'while sleep 2;do printf aaabbbccc134\\\n; done;'",
    Created: 1580450783,
    Ports: [],
    Labels: { Name: 'gcl3-7', Project: 'gcl3' },
    State: 'running',
    Status: 'Up About an hour',
    HostConfig: { NetworkMode: 'default' },
    NetworkSettings: { Networks: [Object] },
    Mounts: []
  }
     ]
     */
    this.memoryContainers = [];
    this.beAddedContainers = [];
    this.beDeletedContainers = [];
};

DockerServer.prototype.eventBusCallback = function(event) {
    if (! event || ! event.target || ! event.target.action) return;
    if (event.target.action === 'add' || event.target.action === 'del') {
        this.lsConfigContainers(() => {
            this.validator();
        });
    }
};

DockerServer.prototype.init = function(httpServer, db) {
    this.db = db;
    this.httpServer = httpServer;
    if (global.EventBus) {
        EventBus.addEventListener('bureau', this.eventBusCallback, this);
    }
    let self = this;
    self.httpServer.route('/docker/ls')
        .get(function(req, res) {
            res.writeHead(200);
            res.end(JSON.stringify(self.memoryContainers));
        });
};

DockerServer.prototype.run = function(config) {
// this.docker run -d --rm alpine /bin/sh -c "while sleep 2;do printf aaabbbccc134\\n; done;"
    let beAddedContainer = this.beAddedContainers.find((c => c.name === config.name));
    if (beAddedContainer) {
        if (Date.now() - beAddedContainer.sendTime < 10000) {
            return;
        }
    }

    this.docker.run('alpine', [], undefined, {
        "Cmd": [
            "/bin/sh",
            "-c",
            "while sleep 2;do printf aaabbbccc134\\\n; done;"
        ],
        "Image": "alpine",
        "Labels": {
            "Project": "gcl3",
            "Name": config.Name
        },
        "HostConfig": {
            "AutoRemove": true,
        },
    }, function(err, data, container) {
        if (err) {
            return console.error(err);
        }
        console.log(data.StatusCode);
        console.log(container);
    });

    if (!beAddedContainer) {
        beAddedContainer = {
            name: config.name
        };
        this.beAddedContainers.push(beAddedContainer);
    }
    beAddedContainer.sendTime = Date.now();
};

DockerServer.prototype.remove = function(id) {
    let beDeletedContainer = this.beDeletedContainers.find((c => c.id === id));
    if (beDeletedContainer) {
        if (Date.now() - beDeletedContainer.sendTime < 10000) {
            return;
        }
    }

    let container = this.docker.getContainer(id);
    if (!container) {
        let index = this.beDeletedContainers.findIndex((c => c.id === id));
        if (index>=0) {
            this.beDeletedContainers.splice(index, 1);
        }
        return;
    }

    function removeHandler(err, data) {
        if (err) {
            console.log('DockerServer: remove error! err= ', err, ', data= ', data);
        }
        else {
            console.log('DockerServer: remove success! data= ', data);
        }
    }

    function stopHandler(err, data) {
        if (err) {
            container.kill(killHandler);
            console.log('DockerServer: Stop: err= ', err);
        }
        else {
            container.remove(removeHandler);
        }
    }

    function killHandler(err, data) {
        if (err) {
            console.log('DockerServer: kill: err= ', err);
        }
        container.remove(removeHandler);
    }

    container.stop(stopHandler);
    if (!beDeletedContainer) {
        beDeletedContainer = {
            id: id
        };
        this.beDeletedContainers.push(beDeletedContainer);
    }
    beDeletedContainer.sendTime = Date.now();
};

DockerServer.prototype.validator = function() {
    let configContainers = this.configContainers;
    let memoryContainers = this.memoryContainers;

    // No Healthy
    for (let j = 0; j < memoryContainers.length; j++) {
        let mContainer = memoryContainers[j];
        if (mContainer.State !== 'running') {
            this.remove(mContainer.Id);
        }
    }
    // sync - remove
    for (let j = 0; j < memoryContainers.length; j++) {
        let mContainer = memoryContainers[j];
        let iIndex = configContainers.findIndex((cContainer) => mContainer.Labels && mContainer.Labels.Name === cContainer.Name);
        if (iIndex < 0) {
            this.remove(mContainer.Id);
        }
    }
    // sync - add
    for (let j = 0; j < configContainers.length; j++) {
        let cContainer = configContainers[j];
        let iIndex = memoryContainers.findIndex((mContainer) => mContainer.Labels && mContainer.Labels.Name === cContainer.Name);
        if (iIndex < 0) {
            this.run(cContainer);
        }
    }
};

DockerServer.prototype.lsConfigContainers = function(callback) {
    if (this.db) {
        this.db.query('select * from bureau', (err, values, fields) => {
            if (!err){
                if (Array.isArray(values) && values.length > 0) {
                    let containers = [];
                    for (let i = 0; i < values.length; i++) {
                        let row = values[i];
                        let id = row['id'];
                        if (id >= 0) {
                            let c = {
                                "Name": 'gcl3-' + id,
                            };
                            containers.push(c);
                        }
                    }
                    this.configContainers = containers;
                } else {
                    this.configContainers = [];
                }
                if (callback) {
                    callback();
                }
            }
        });
    }
};

DockerServer.prototype.lsMemoryContainers = function() {
    let self = this;
    self.docker.listContainers(
        {
            filters: {
                "label": [
                    "Project=gcl3",
                ]
            }
        },
        (err, containers) => {
            if (err) {
                console.log('docker.listContainers: ', err);
            }
            if (Array.isArray(containers)) {
                for (let i = 0; i < containers.length; i++) {
                    let container = containers[i];
                    if (container.State === 'running') {
                        if (container.Labels && container.Labels.Name) {
                            let index = self.beAddedContainers.findIndex(c => c.name === container.Labels.Name);
                            if (index >= 0) {
                                self.beAddedContainers.splice(index, 1);
                            }
                        }
                    }
                }
                for (let i = self.beDeletedContainers.length-1; i >= 0; i--) {
                    let beDeletedContainer = self.beDeletedContainers[i];
                    let index = containers.findIndex(c => c.Id === beDeletedContainer.id);
                    if (index < 0) {
                        self.beDeletedContainers.splice(i, 1);
                    }
                }
                self.memoryContainers = containers;
                console.log('docker.listContainers: ', containers);
            } else {
                self.memoryContainers = [];
            }
        }
        );
};

DockerServer.prototype.start = function() {
    let self = this;
    self.lsConfigContainers(() => {
        self.lsMemoryContainers();
    });

    self.timeOutCount = 0;
    self.timeOutHandle = setInterval(() => {
        self.timeOutCount ++;
        if (self.timeOutCount % 20 === 0) {
            self.lsConfigContainers();
        } else {
            if (self.timeOutCount % 2 === 0) {
                self.validator();
                console.log('DockerServer: validator');
            } else {
                self.lsMemoryContainers();
                console.log('DockerServer: listContainers');
            }
        }
    }, 1500);
};

DockerServer.prototype.stop = function() {
    if (this.timeOutHandle) {
        clearInterval(this.timeOutHandle);
        this.timeOutHandle = null;
    }
};

exports = module.exports = DockerServer;
