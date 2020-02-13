let fs = require('fs');
let Docker = require('dockerode');

const ProcessStateEnum = Object.freeze({
    "none": 0,
    "listingConfig": 1,
    "listedConfig": 2,
    "listingMemory1": 3,
    "listedMemory1": 4,
    "listingValidator": 5,
    "listingMemory2": 6,
    "listedMemory2": 7,
    "listedValidator": 8,
    "end": 9
});

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

    this.processState = ProcessStateEnum.none;
    this.processStateTime = Date.now();

    this.eventQueue = [];

    this.timeOutCount = 0;
};

DockerServer.checkSameContainers = function(containers1, containers2) {
    if (containers1.length === containers2.length) {
        for (let i = 0; i < containers2.length; i++) {
            let container = containers2[i];
            if (containers1.findIndex((c) => c.Id === container.Id) < 0) {
                return false;
            }
        }
        return true;
    }
    return false;
};

DockerServer.getContainerBureauId = function(container) {
    let sName = container.Labels.Name;
    return sName.substring(sName.lastIndexOf('-') + 1);
};

DockerServer.prototype.lsConfigContainers = function() {
    if (this.db) {
        this.setProcessState(ProcessStateEnum.listingConfig);
        this.db.query('select * from bureau', (err, values, fields) => {
            if (!err) {
                if (Array.isArray(values) && values.length > 0) {
                    let containers = [];
                    for (let i = 0; i < values.length; i++) {
                        let row = values[i];
                        let id = row['id'];
                        if (id >= 0) {
                            let c = {
                                "Id": id,
                                "Name": 'gcl3-' + id,
                                "Row": row,
                            };
                            containers.push(c);
                        }
                    }
                    this.configContainers = containers;
                }
                else {
                    this.configContainers = [];
                    console.log('DockerServer lsConfigContainers - result is null!');
                }
                this.setProcessState(ProcessStateEnum.listedConfig);
                this.lsMemoryContainers1();
            }
        });
    }
    else {
        console.log('DockerServer lsConfigContainers - system error ( db is null )!');
    }
};

DockerServer.prototype.lsMemoryContainers1 = function() {
    let self = this;
    self.setProcessState(ProcessStateEnum.listingMemory1);
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
                console.log('DockerServer lsMemoryContainers1: ', err);
            }
            let newContainers = [];
            if (Array.isArray(containers)) {
                newContainers = containers;
            }
            if (!DockerServer.checkSameContainers(self.memoryContainers, newContainers)) {
                console.log('DockerServer lsMemoryContainers1: ', self.memoryContainers);
            }
            else {
                console.log('DockerServer lsMemoryContainers1 same to up.');
            }
            self.memoryContainers = newContainers;
            self.setProcessState(ProcessStateEnum.listedMemory1);
            self.validator();
        }
    );
};

// this.docker run -d --rm alpine /bin/sh -c "while sleep 2;do printf aaabbbccc134\\n; done;"
DockerServer.prototype.run = function(config) {
    let self = this;

    let beAddedContainer = self.beAddedContainers.find((c => c.Name === config.Name));
    if (beAddedContainer) {
        // for repeat add
        if (Date.now() - beAddedContainer.sendTime < 10000) {
            console.log('DockerServer: run ( for repeat add ), so do not run!');
            return;
        }
    }
    else {
        beAddedContainer = {
            Name: config.Name
        };
        this.beAddedContainers.push(beAddedContainer);
    }
    beAddedContainer.sendTime = Date.now();

    self.docker.run('alpine', [], undefined, {
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
    }, (err, data, container) => {
        let index = self.beAddedContainers.findIndex((c => c.Name === config.Name));
        if (index >= 0) {
            self.beAddedContainers.splice(index, 1);
        }
        if (err) {
            return console.error(err);
        }
        console.log('DockerServer: run result ( ', data.StatusCode, container, ' )');
        self.operationFinish();
    });

};

DockerServer.prototype.remove = function(id) {
    let self = this;
    // for repeat delete
    let beDeletedContainer = self.beDeletedContainers.find((c => c.Id === id));
    if (beDeletedContainer) {
        if (Date.now() - beDeletedContainer.sendTime < 10000) {
            return;
        }
    }
    else {
        beDeletedContainer = {
            Id: id
        };
        self.beDeletedContainers.push(beDeletedContainer);
    }
    beDeletedContainer.sendTime = Date.now();

    let container = self.docker.getContainer(id);
    if (!container) {
        let index = self.beDeletedContainers.findIndex((c => c.Id === id));
        if (index >= 0) {
            self.beDeletedContainers.splice(index, 1);
        }
        console.log('DockerServer: remove error! self.docker.getContainer(id) is null. id = ', id);
        self.operationFinish();
        return;
    }

    function removeHandler(err, data) {
        if (err) {
            console.log('DockerServer: remove error! err= ', err, ', data= ', data);
        }
        else {
            console.log('DockerServer: remove success! data= ', data);
        }
        let index = self.beDeletedContainers.findIndex((c => c.Id === id));
        if (index >= 0) {
            self.beDeletedContainers.splice(index, 1);
        }
        self.operationFinish();
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

DockerServer.prototype.operationFinish = function() {
    if (this.beAddedContainers.length === 0 && this.beDeletedContainers.length === 0) {
        this.lsMemoryContainers2();
    }
};

DockerServer.prototype.validator = function() {
    this.setProcessState(ProcessStateEnum.listingValidator);
    let configContainers = this.configContainers;
    let memoryContainers = this.memoryContainers;

    this.beAddedContainers = [];
    this.beDeletedContainers = [];

    let hasOperation = false;

    // No Healthy
    for (let j = 0; j < memoryContainers.length; j++) {
        let mContainer = memoryContainers[j];
        if (mContainer.State !== 'running') {
            console.log("DockerServer validator mContainer.State !== 'running' , mContainer: ", mContainer);
            this.remove(mContainer.Id);
            hasOperation = true;
        }
    }
    // sync - remove
    for (let j = 0; j < memoryContainers.length; j++) {
        let mContainer = memoryContainers[j];
        let iIndex = configContainers.findIndex((cContainer) => mContainer.Labels && mContainer.Labels.Name === cContainer.Name);
        if (iIndex < 0) {
            this.remove(mContainer.Id);
            hasOperation = true;
        }
    }
    // sync - add
    for (let j = 0; j < configContainers.length; j++) {
        let cContainer = configContainers[j];
        let iIndex = memoryContainers.findIndex((mContainer) => mContainer.Labels && mContainer.Labels.Name === cContainer.Name);
        if (iIndex < 0) {
            this.run(cContainer);
            hasOperation = true;
        }
    }

    if (!hasOperation) {
        this.setProcessState(ProcessStateEnum.listedValidator);
    }
};

DockerServer.prototype.lsMemoryContainers2 = function() {
    let self = this;
    self.setProcessState(ProcessStateEnum.listingMemory2);
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
                console.log('DockerServer lsMemoryContainers2 - err: ', err);
            }
            let newContainers = [];
            if (Array.isArray(containers)) {
                for (let i = 0; i < containers.length; i++) {
                    let container = containers[i];
                    if (container.State === 'running') {
                        if (container.Labels && container.Labels.Name) {
                            let index = self.beAddedContainers.findIndex(c => c.Name === container.Labels.Name);
                            if (index >= 0) {
                                self.beAddedContainers.splice(index, 1);
                            }
                        }
                    }
                }
                for (let i = self.beDeletedContainers.length - 1; i >= 0; i--) {
                    let beDeletedContainer = self.beDeletedContainers[i];
                    let index = containers.findIndex(c => c.Id === beDeletedContainer.Id);
                    if (index < 0) {
                        self.beDeletedContainers.splice(i, 1);
                    }
                }
                newContainers = containers;
            }
            if (!DockerServer.checkSameContainers(self.memoryContainers, newContainers)) {
                console.log('DockerServer lsMemoryContainers2: ', self.memoryContainers);
            }
            else {
                console.log('DockerServer lsMemoryContainers2 same to up.');
            }
            self.memoryContainers = newContainers;
            self.setProcessState(ProcessStateEnum.listedMemory2);
            if (self.beAddedContainers.length > 0) {
                console.log('DockerServer lsMemoryContainers2 - beAddedContainers: ', self.beAddedContainers);
            }
            if (self.beDeletedContainers.length > 0) {
                console.log('DockerServer lsMemoryContainers2 - beDeletedContainers: ', self.beDeletedContainers);
            }
            self.setProcessState(ProcessStateEnum.listedValidator);
        }
    );
};

DockerServer.prototype.setProcessState = function(state) {
    this.processState = state;
    this.processStateTime = Date.now();
};

DockerServer.prototype.eventBusCallback = function(event) {
    if (!event || !event.target || !event.target.action) return;
    if (event.target.action === 'add' || event.target.action === 'del') {
        if (this.processState === ProcessStateEnum.listedValidator) {
            this.lsConfigContainers();
        }
        else {
            this.eventQueue.push(event);
        }
    }
};

DockerServer.prototype.init = function(httpServer, db) {
    this.db = db;
    this.httpServer = httpServer;
    if (global.EventBus) {
        EventBus.addEventListener('bureau', this.eventBusCallback, this);
    }
    let self = this;

    let parseBody = function(req, res, body) {
        if (body) {
            let r = undefined;
            try {
                r = JSON.parse(body);
            }
            catch (e) {
                let err = 'error: JSON.parse(body) by url :' + req.url;
                console.log(err);
                res.writeHead(500);
                res.end(JSON.stringify({code: 500, msg: err}));
            }
            return r;
        }
        return undefined;
    };

    /**
     // request url：
     http://localhost:xxxx/container/query

     action: ['ls', 'add', 'edit', 'del']
     token.state: ['req', 'ing', 'ed', 'del']
     */

    /** ls.req.json
     {
     session: Date.now(),
     action: 'ls',
    }
     // ls.resp.json
     {
     session: ^,
     action: ^,
     data: { configContainers,memoryContainers },
     state: {err:null}
    }
     */

    httpServer.route('/container/query')
        .post(function(req, res) {
            let body = '';
            req.on('data', function(chunk) {
                body += chunk;
            });
            req.on('end', function() {
                let respError = (err, code) => {
                    let code2 = code ? code : 500;
                    let data = {err: 'error: ' + err, code: code2}
                    res.writeHead(code2);
                    res.end(JSON.stringify(data));
                    console.log(data);
                };

                let reqBody = parseBody(req, res, body);
                if (!reqBody) return;
                let {session, action} = reqBody;

                if (action === 'ls') {
                    let r = {
                        session: session,
                        action: action,
                        data: {
                            configContainers: self.configContainers,
                            memoryContainers: self.memoryContainers
                        },
                        state: {err: null}
                    };
                    res.writeHead(200);
                    res.end(JSON.stringify(r));
                }
                else {
                    respError('action is invalid: ' + action);
                }
            });
        });

};

DockerServer.prototype.reset = function() {
    this.processState = ProcessStateEnum.listedValidator;
    for (let i = this.eventQueue.length - 1; i >= 0; i++) {
        let event = this.eventQueue[i];
        if (event.target.action === 'add' || event.target.action === 'del') {
            this.eventQueue.splice(i, 1);
        }
    }
    this.lsConfigContainers();
};

DockerServer.prototype.stats = function(memoryContainer) {
    let self = this;
    let containerId = String(memoryContainer.Id);
    let container = self.docker.getContainer(containerId);
    if (!container) {
        console.log('DockerServer: stats error! self.docker.getContainer(id) is null. id = ', containerId);
        return;
    }

    function statsHandler(err, stream) {
        if (err) {
            console.log('DockerServer: stats error! err= ', err);
        }
        if (!stream) return;
        let cpu_stats = stream.cpu_stats;
        let precpu_stats = stream.precpu_stats;
        if (!cpu_stats || !precpu_stats) return;
        let memory_stats = stream.memory_stats;
        if (!memory_stats) return;
        // https://github.com/moby/moby/issues/29306
        // https://forums.docker.com/t/how-to-calculate-the-cpu-usage-in-percent/27509
        // https://stackoverflow.com/questions/35692667/in-docker-cpu-usage-calculation-what-are-totalusage-systemusage-percpuusage-a
        // let cpuPercent = 0.0
        // // calculate the change for the cpu usage of the container in between readings
        // let cpuDelta = cpuUsage.TotalUsage - float64(previousCPU)
        // // calculate the change for the entire system between readings
        // systemDelta = float64(v.CPUStats.SystemUsage) - float64(previousSystem)
        //
        // if systemDelta > 0.0 && cpuDelta > 0.0 {
        //     cpuPercent = (cpuDelta / systemDelta) * float64(len(v.CPUStats.CPUUsage.PercpuUsage)) * 100.0
        // }

        let delta_total_usage = (cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage);
        let delta_system_usage = (cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage);
        let cpuPercent = (delta_total_usage / delta_system_usage) * cpu_stats.cpu_usage.percpu_usage.length * 100.0;

        // let delta_total_usage = (cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage) / precpu_stats.cpu_usage.total_usage;
        // let delta_system_usage = (cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage) / precpu_stats.system_cpu_usage;
        // let cpuPercent = (delta_total_usage / delta_system_usage) * cpu_stats.cpu_usage.percpu_usage.length * 100.0;
        //
        // console.log(cpuPercent);
        //
        // console.log(memory_stats.usage, memory_stats.max_usage, memory_stats.limit);

        if (self.db) {
            let BureauId = DockerServer.getContainerBureauId(memoryContainer);
            let sqlInsert = ["INSERT INTO `db1`.`container_stat`(`bureauId`, `containerId`, `cpuPercent`, `memUsage`, `memMaxUsage`, `memLimit`, `statTime`) VALUES ("];
            sqlInsert.push(BureauId + ',');
            sqlInsert.push("'" + containerId + "',");
            sqlInsert.push(cpuPercent.toFixed(3) + ',');
            sqlInsert.push(String(memory_stats.usage) + ',');
            sqlInsert.push(String(memory_stats.max_usage) + ',');
            sqlInsert.push(String(memory_stats.limit) + ',');
            sqlInsert.push(String(Date.now()));
            sqlInsert.push(");");
            let sql = sqlInsert.join('');
            try {
                self.db.query(sql);
            }
            catch (e) {
                console.log(sql);
                console.log(e);
            }
        }
    }

    container.stats({stream: false}, statsHandler);
};

DockerServer.prototype.lsStatContainers = function() {
    for (let i = 0; i < this.memoryContainers.length; i++) {
        let memoryContainer = this.memoryContainers[i];
        this.stats(memoryContainer);
    }
};

// todo
DockerServer.prototype.timeOut = function() {
    this.timeOutCount++;
    let dtNow = Date.now();

    // process exception
    if (this.processState !== ProcessStateEnum.listedValidator) {
        if (dtNow - this.processStateTime > 6000) {
            this.reset();
        }
    }
    else {
        if (this.timeOutCount % 10 === 0) {
            this.lsConfigContainers();
        }
        else {
            if (this.timeOutCount % 7 === 0) {
                this.lsStatContainers();
            }
        }
    }
};

DockerServer.prototype.start = function() {
    let self = this;
    self.lsConfigContainers();

    self.timeOutCount = 0;
    self.timeOutHandle = setInterval(() => {
        self.timeOut();
    }, 1000);
};

DockerServer.prototype.stop = function() {
    if (this.timeOutHandle) {
        clearInterval(this.timeOutHandle);
        this.timeOutHandle = null;
    }
};

exports = module.exports = DockerServer;
