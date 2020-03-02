FROM oudream/ubuntu-ccxx-dev:18.04.11

RUN cd /opt && \
    git clone https://github.com/oudream/ccxx.git && \
    cd ccxx && \
    cmake . -DCMAKE_BUILD_TYPE=Debug --build . -B"./build/cmake-gcc" && \
    cd build/cmake-gcc && make
