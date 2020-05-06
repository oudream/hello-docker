
### git
```bash

git clone https://github.com/oudream/hello-docker.git --recursive

```

### docker man, command line
- [docker.sh](./man/docker.sh)


### hello dockerfile
- [alpine](./hello/alpine)
- [ubuntu](./hello/ubuntu)
- [nginx](./hello/nginx)
- [httpserver](./hello/httpserver)


### hello docker api
- [api for go](./hello/api/container-run-background1)
- [api for go](./hello/api/container-run1)
- [api for node](./hello/api/master1)


### docker refer to 
- [refer to](./referto)

### docker network
- https://docs.docker.com/network/network-tutorial-standalone/

## docker api
- https://docs.docker.com/develop/sdk/examples/
- https://docs.docker.com/engine/api/v1.40/#operation/ImageInspect
- https://docs.docker.com/develop/sdk/
- https://docker-py.readthedocs.io/en/stable/images.html
- https://github.com/docker/docker-py/blob/master/docker/api/image.py
- https://github.com/swipely/docker-api/blob/master/lib/docker/image.rb
- https://github.com/CenturyLinkLabs/dockerfile-from-image/blob/master/dockerfile-from-image.rb
- https://docs.docker.com/apidocs/docker-cloud/
- https://github.com/moby/moby/tree/master/client
- https://godoc.org/github.com/docker/docker/client
```bash
open https://docs.docker.com/develop/sdk/examples/
open https://docs.docker.com/engine/api/v1.40
```

优点:
    1. 灵活性, 可重用性和可扩展性;
2. 可以大大减少开发时间，模板可以把用同一个算法去适用于不同类型数据，在编译时确定具体的数据类型;
3. 模版模拟多态要比C++类继承实现多态效率要高, 无虚函数, 无继承;
缺点:
    1. 易读性比较不好，调试比较困难;
2. 模板的数据类型只能在编译时才能被确定;
3. 所有用基于模板算法的实现必须包含在整个设计的.h头文件中, 当工程比较大的时候, 编译时间较长;
