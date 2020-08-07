#!/usr/bin/env bash

docker create --name=test centos:latest /bin/sh -c "while true; do echo hello world; sleep 1; done"
