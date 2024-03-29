#!/bin/bash


readonly VERSION='1.0.0'

cd "$(dirname $0)"

docker build -t oudream/gcl3-nginx-alpine:1.0.2 .
#docker build ${@} -t oudream/gcl3-nginx-alpine:${VERSION} .
#
#docker push oudream/gcl3-nginx-alpine:${VERSION}


#docker build -t nginx-upload:v1 . -f Dockerfile

# run on remote pc (google cloud)
docker run -d -p 2280:80 -p 2288:8080 --name nginx-upload oudream/gcl3-nginx-alpine:1.0.2
open 34.66.82.34:2288
open localhost:2288

cd /opt/limi/hello-docker/hello/nginx/upload1
sFp1=$PWD/readme.md
curl  -F "file=@${sFp1};type=text/plain;filename=a1" 34.66.82.34:2280/upload
curl  -F "file=@${sFp1};type=text/plain;filename=a1" localhost:2280/upload

/tmp/nginx_upload/

# run on local host
docker run -d -p 2280:80 -p 2288:8080 --name nginx-upload oudream/gcl3-nginx-alpine:1.0.2

open 34.66.82.34:2288

cd /opt/limi/hello-docker/hello/nginx/upload1
sFp1=$PWD/readme.md
curl  -F "file=@${sFp1};type=text/plain;filename=a1" 34.66.82.34:2280/upload

/tmp/nginx_upload/



cat >> backup.nginx_upload.default.conf <<EOF
server {
    listen 80;

    # Allow file uploads max 1024M for example
    client_max_body_size 1024M;
    upload_buffer_size 10M;

    # POST URL
    location /upload {
        # Pass altered request body to this location
        upload_pass @after_upload;

        # Store files to this directory
        upload_store /tmp/nginx_upload/;

        # Allow uploaded files to be world readable
        upload_store_access user:rw group:rw all:r;

        # Set specified fields in request body
        upload_set_form_field $upload_field_name.name "$upload_file_name";
        upload_set_form_field $upload_field_name.content_type "$upload_content_type";
        upload_set_form_field $upload_field_name.path "$upload_tmp_path";

        # Inform backend about hash and size of a file
        upload_aggregate_form_field $upload_field_name.md5 "$upload_file_md5";
        upload_aggregate_form_field $upload_field_name.size "$upload_file_size";

        upload_pass_form_field "^newfilename$|^market$";

        upload_cleanup 400 404 499 500-505;
    }

    location @after_upload {
        add_header Content-Type "text/plain;charset=utf-8";
        return 200 "upload success, and you can find the file at docker continaer path /tmp/nginx_upload/";
    }
}
EOF
