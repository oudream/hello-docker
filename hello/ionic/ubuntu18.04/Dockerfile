FROM  ubuntu:18.04

LABEL description="ionic on Ubuntu 18.04"

#Variaveis de Ambiente
ENV DEBIAN_FRONTEND=noninteractive \
    JAVA_VERSION=8 \
    NODE_VERSION=8.11.2 \
    NPM_VERSION=5.6.0 \
    IONIC_VERSION=3.9.2 \
    CORDOVA_VERSION=9.0.0 \
    GRADLE_VERSION=4.10.3 \
    BUILD_TOOLS=28.0.3 \
    PLATAFORMS=android-28 \
    ANDROID_HOME=/opt

#Dependencias
RUN apt update -y &&\
    apt upgrade -y &&\
    apt install -y apt-utils &&\
    apt install curl unzip zip -y &&\
    apt install openjdk-"$JAVA_VERSION"-jdk -y &&\
    export JAVA_HOME=/usr/lib/jvm/java-$JAVA_VERSION-openjdk-amd64 &&\
    apt install -y git wget curl unzip build-essential ruby ruby-dev ruby-ffi gcc make && \
    curl --retry 3 -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" && \
    tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 && \
    rm "node-v$NODE_VERSION-linux-x64.tar.gz" && \
    npm install -g npm@"$NPM_VERSION" &&\
    npm install -g cordova@"$CORDOVA_VERSION" ionic@"$IONIC_VERSION" &&\
    npm cache clear --force &&\
    gem install sass &&\
    git config --global user.email "you@example.com" &&\
    git config --global user.name "Your Name"

# SDK Tools
RUN cd /opt &&\
    wget https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip &&\
    unzip sdk-tools-linux-4333796.zip &&\
    rm -f sdk-tools-linux-4333796.zip &&\
    chown -R root. /opt

# Config Plataforms
RUN yes | /opt/tools/bin/sdkmanager --include_obsolete platform-tools "platform-tools" "platforms;$PLATAFORMS" "build-tools;$BUILD_TOOLS"

# Install Gradle
RUN wget https://services.gradle.org/distributions/gradle-"$GRADLE_VERSION"-bin.zip && \
    mkdir /opt/gradle && \
    unzip -d /opt/gradle gradle-"$GRADLE_VERSION"-bin.zip && \
    rm -rf gradle-"$GRADLE_VERSION"-bin.zip

# Sentando varaveis no PATH
ENV PATH ${PATH}:/opt/platform-tools:/opt/tools:/opt/gradle/gradle-"$GRADLE_VERSION"/bin

# Configurando diretorio de Trabalho
# WORKDIR dados

#Expondo Portas
EXPOSE 8100 35729 5037
