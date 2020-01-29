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
    Id: 'f99a23a41972b68ce64cc86cb4d36bdf71867d75e5ecac4418be7a49bf53580d',
    Names: [ '/gallant_mcclintock' ],
    Image: 'alpine',
    ImageID: 'sha256:cc0abc535e36a7ede71978ba2bbd8159b8a5420b91f2fbc520cdf5f673640a34',
    Command: "/bin/sh -c 'while sleep 2;do printf aaabbbccc134\\\\\\n; done;'",
    Created: 1579016503,
    Ports: [],
    Labels: {},
    State: 'running',
    Status: 'Up 3 minutes',
    HostConfig: { NetworkMode: 'default' },
    NetworkSettings: { Networks: [Object] },
    Mounts: []
  },
     {
    Id: '5df5f1351abc326ac11e89d614d5513896d2a6c394879e163ed7cc7eb2dba900',
    Names: [ '/heuristic_bardeen' ],
    Image: 'alpine',
    ImageID: 'sha256:cc0abc535e36a7ede71978ba2bbd8159b8a5420b91f2fbc520cdf5f673640a34',
    Command: "/bin/sh -c 'while sleep 2;do printf aaabbbccc134\\\\\\n; done;'",
    Created: 1579014598,
    Ports: [],
    Labels: {},
    State: 'running',
    Status: 'Up 30 minutes',
    HostConfig: { NetworkMode: 'default' },
    NetworkSettings: { Networks: [Object] },
    Mounts: []
  }
     ]
     */
    this.memoryContainers = [];

    this.timeOutIsList = true;
};

DockerServer.prototype.eventBusCallback = function(event) {
    if (event.action === 'add') {

    }
    else if (action === 'edit') {

    }
    else if (action === 'del') {

    }
    this.lsConfigContainers();
};

DockerServer.prototype.init = function(httpServer, db) {
    this.db = db;
    this.httpServer = httpServer;
    if (global.EventBus) {
        EventBus.addEventListener('bureau', this.eventBusCallback, this);
    }
};


DockerServer.prototype.run = function(config) {
// this.docker run -d --rm alpine /bin/sh -c "while sleep 2;do printf aaabbbccc134\\n; done;"
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
};

DockerServer.prototype.remove = function(id) {
    let container = this.docker.getContainer(id);
    if (!container) {
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
};

DockerServer.prototype.validator = function() {
    let configContainers = this.configContainers;
    let memoryContainers = this.memoryContainers;
    for (let i = 0; i < configContainers.length; i++) {
        let config = configContainers[i];
        let bRun = true;
        for (let j = 0; j < memoryContainers.length; j++) {
            let container = memoryContainers[j];
            if (container.Labels && container.Labels.Name === config.Name) {
                if (container.State !== 'running') {
                    this.remove(container.Id);
                }
                else {
                    bRun = false;
                    continue;
                }
            }
        }
        if (bRun) {
            this.run(config);
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
    this.docker.listContainers(
        {
            filters: {
                "label": [
                    "Project=gcl3",
                ]
            }
        },
        function(err, containers) {
            this.memoryContainers = containers;
            console.log(containers);
        });
};

DockerServer.prototype.start = function() {
    this.lsConfigContainers(() => {
        this.validator();
    });

    this.timeOut3000 = setInterval(() => {
        if (this.timeOutIsList) {
            this.listContainers();
            console.log('DockerServer: listContainers');
        }
        else {
            this.validator();
            console.log('DockerServer: validator');
        }
        this.timeOutIsList = this.timeOutIsList;
    }, 3000);
};

DockerServer.prototype.stop = function() {
    if (this.timeOut3000) {
        clearInterval(this.timeOut3000)
    }
};

exports = module.exports = DockerServer;
