FROM python:3.7.5-alpine3.10

ADD . /code

WORKDIR /code

RUN pip install Flask && \
    chmod +x httpserver.py

ENTRYPOINT ["python", "httpserver.py"]