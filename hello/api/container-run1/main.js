var Docker = require('dockerode');

var docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

// docker run -d --rm alpine /bin/sh -c "while sleep 2;do printf aaabbbccc134\\n; done;"
docker.run('alpine', [], undefined, {
    "Cmd": [
        "/bin/sh",
        "-c",
        "while sleep 2;do printf aaabbbccc134\\\n; done;"
    ],
    "Image": "alpine",
    "Labels": {
        "Project": "gcl3",
    },
    "HostConfig": {
        "AutoRemove": true,
    },
}, function(err, data, container) {
    if (err){
        return console.error(err);
    }
    console.log(data.StatusCode);
    console.log(container);
});

docker.listContainers({all: true}, function(err, containers) {
    console.log('ALL: ' + containers.length);
    console.log(containers);
});

