#!/usr/bin/env bash

### install node npm chrome puppeteer
# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
#
# https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages
#
# https://github.com/nodesource/distributions/blob/master/README.md
#
# chrome
# https://stackoverflow.com/questions/50942353/e-repository-http-dl-google-com-linux-chrome-deb-stable-release-changed-its



wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
&& apt-get update \
&& apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf --no-install-recommends \
&& rm -rf /var/lib/apt/lists/*


cd /opt \
&& apt-get update -y ; apt-get upgrade -y \
&& apt-get install sudo curl wget vim -y \
&& curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash - \
&& sudo apt-get install -y nodejs \
&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
&& apt-get update \
&& export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true" \
&& npm i puppeteer \
&& rm -rf /var/lib/apt/lists/*


cd /opt \
&& apt-get update -y ; apt-get upgrade -y \
&& apt-get install sudo curl wget vim -y \
&& curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash - \
&& sudo apt-get install -y nodejs \
&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
&& apt-get update \
&& npm i puppeteer \
&& rm -rf /var/lib/apt/lists/*



### ok
cd /opt \
&& apt-get update -y ; apt-get upgrade -y \
&& apt-get install sudo curl wget vim -y \
&& curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash - \
&& sudo apt-get install -y nodejs \
&& npm i puppeteer

