# https://github.com/CenturyLinkLabs/dockerfile-from-image
# https://github.com/CenturyLinkLabs/dockerfile-from-image/issues/14

docker build -t docker-from-file-image .
#Make sure that /run/docker.sock exist on your system, if not, try with /var/run/docker.sock instead.

#For the, it was the problem, i was using /run/docker.sock while the right path for my system was /var/run/docker.sock

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock  docker-from-file-image  docker-from-file-image
#---------------
#FROM alpine:3.2
#RUN apk --update add ruby-dev ca-certificates && gem install --no-rdoc --no-ri docker-api && apk del ruby-dev ca-certificates && apk add ruby ruby-json && rm /var/cache/apk/*
#ADD file:8a5c43d666322dd4df724cc7c2c838b2ef82e3656edcb4af264bcc89aedd4502 in /usr/src/app/dockerfile-from-image.rb
#RUN chmod +x /usr/src/app/dockerfile-from-image.rb

#I would say the result is close enough ;)

#Docker version 1.13.0-rc4 on Mac OS X.11.6