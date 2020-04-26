#!/usr/bin/env bash


# dev-server = build vue, run httpserver
# dev-runner = build vue, run electron

# webpack.base.conf.fs : pack vue
# webpack.dev.conf.fs : pack vue and hot reload
# webpack.prod.conf.fs : pack vue to bin
# webpack.main.conf.js :
# webpack.renderer.conf.js

# dev-client : vue reload


### 这里有两套编译方案
## 1
# build-vue.js
# dev-server.js
# check-versions.js
# dev-client.js
# readme.sh
# utils.js
# vue-loader.conf.js
# webpack.base.conf.js
# webpack.dev.conf.js
# webpack.prod.conf.js

## 2
# build-vue-electron.js         = pack vue , pack main to electron / web
# dev-vue-electron.js           = pack vue , pack main, start electron
# webpack.main.conf.js          = pack electron main
# webpack.renderer.conf.js      = pack vue to electron = webpack.dev.conf.fs + webpack.base.conf.fs
# webpack.web.conf.js           = pack vue to web
# dev-client.js
