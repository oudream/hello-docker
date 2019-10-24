FROM httpsserver-flask1:latest

COPY . /code

RUN pip install pyopenssl && \
    chmod +x httpsserver.py

ENTRYPOINT ["python", "httpsserver.py"]
