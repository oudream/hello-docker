#!/usr/bin/env bash

docker build -t httpsserver .

docker run -d httpsserver