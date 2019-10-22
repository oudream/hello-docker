#!/usr/bin/env bash

docker build -t httpsserver-flask1 .

docker run -d httpsserver-flask1