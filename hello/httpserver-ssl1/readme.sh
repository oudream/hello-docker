#!/usr/bin/env bash

openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

docker build -t httpserver-ssl1 .

docker run -d httpserver-ssl1