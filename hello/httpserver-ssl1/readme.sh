#!/usr/bin/env bash

openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

docker build -t httpsserver-flask1 .

docker run -d httpsserver-flask1