FROM oudream/ionic3-android-ubuntu:1.0.2

LABEL description="ionic3 components Ubuntu 18.04"

#
RUN cd /opt &&\
    mkdir -p limi && cd limi &&\
    git clone "https://github.com/yannbf/ionic3-components.git" && cd ionic3-components &&\
    npm install -y&&\
    ionic cordova platform add android -y&&\
    ionic cordova resources android&&\
    ionic cordova resources -f&&\
    ionic cordova build android -y
