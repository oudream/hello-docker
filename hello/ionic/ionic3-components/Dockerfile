FROM oudream/ionic3-android-ubuntu:1.0.1

LABEL description="ionic3 components Ubuntu 18.04"

#
RUN cd /opt &&\
    mkdir -p limi && cd limi &&\
    git clone "https://github.com/yannbf/ionic3-components.git" && cd ionic3-components &&\
    npm install -y&&\
    ionic cordova platform add android -y&&\
    ionic cordova build android

# Configurando diretorio de Trabalho
# WORKDIR dados

# Expondo Portas
# EXPOSE 8100 35729 5037
