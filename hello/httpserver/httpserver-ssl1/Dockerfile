FROM httpsserver-flask1:latest

ADD . /code

RUN apk add --no-cache \
        libressl-dev \
        musl-dev \
        libffi-dev \
    pip install --no-cache-dir pyopenssl && \
    apk del libressl-dev \
        musl-dev \
        libffi-dev

ENTRYPOINT ["python", "httpsserver.py"]
