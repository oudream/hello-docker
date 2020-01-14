#!/usr/bin/env bash

docker volume create portainer_data
docker run -d -p 2211:9000 -p 2210:8000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer