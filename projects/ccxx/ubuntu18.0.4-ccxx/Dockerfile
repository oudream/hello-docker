FROM oudream/ubuntu-ccxx-dev:18.04.12

RUN apt update -y && \
    cd /opt && \
    git clone https://github.com/oudream/ccxx.git && \
    cd ccxx && \
    cmake . -DCMAKE_BUILD_TYPE=Debug -DCCXX_BUILD_TYPE=all --build . -B"./build/cmake-gcc" && \
    cd build/cmake-gcc && make &&
    rm -rf /var/lib/apt/lists/*

