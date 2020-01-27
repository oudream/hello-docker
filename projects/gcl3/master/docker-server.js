let Docker = require('dockerode');

let fs     = require('fs');

let socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
let stats  = fs.statSync(socket);

if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?');
}

let _docker = new Docker({
    socketPath: '/var/run/docker.sock',
    // timeout: 100
});

// you may specify a timeout (in ms) for all operations, allowing to make sure you don't fall into limbo if something happens in docker
// let _docker = new Docker({host: 'http://127.0.0.1', port: 2375, timeout: 100});

let _configs = [];
for (let i = 0; i < 5; i++) {
    let c = {
        "Name": 'gcl3-' + i,
    };
    _configs.push(c);
}

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
let _list = [];

let fnRun = function(config) {
// docker run -d --rm alpine /bin/sh -c "while sleep 2;do printf aaabbbccc134\\n; done;"
    _docker.run('alpine', [], undefined, {
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

let fnRemove = function(id) {
    let container = docker.getContainer(id);
    if (!container) {
        return;
    }

    function removeHandler(err, data) {
        if (err) {
            console.log('remove error! err= ', err, ', data= ', data);
        }
        else {
            console.log('remove success! data= ', data);
        }
    }

    function stopHandler(err, data) {
        if (err) {
            console.log('Stop: err= ', err);
        }
        else {
            container.remove(removeHandler);
        }
    }

    container.stop(stopHandler);
};

let fnValidator = function() {
    for (let i = 0; i < _configs.length; i++) {
        let config = _configs[i];
        let bRun = true;
        for (let j = 0; j < _list.length; j++) {
            let container = _list[j];
            if (container.Labels && container.Labels.Name === config.Name) {
                if (container.State !== 'running') {
                    fnRemove(container.Id);
                } else {
                    bRun = false;
                    continue;
                }
            }
        }
        if (bRun) {
            fnRun(config);
        }
    }
};
fnValidator();


let fnListContainers = function() {
    _docker.listContainers(
        {
            filters: {
                "label": [
                    "Project=gcl3",
                ]
            }
        },
        function(err, containers) {
            _list = containers;
            console.log(_list);
        });
};

let _timeOutIsList = true;
setInterval(()=>{
    if (_timeOutIsList) {
        fnListContainers();
        console.log('fnListContainers');
    } else {
        fnValidator();
        console.log('fnValidator');
    }
    _timeOutIsList = !_timeOutIsList;
}, 3000);

let DockerServer = function() {
};

DockerServer.prototype.init = function(httpServer, db) {

};

exports = module.exports = DockerServer;
