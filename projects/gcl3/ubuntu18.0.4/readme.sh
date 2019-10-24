#!/usr/bin/env bash

docker build -t ubuntu18.0.4-gcl3 .

docker run -d python3a