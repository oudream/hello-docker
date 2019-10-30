
# https://github.com/openhs/docker-ubuntu-x

docker run --rm -e DISPLAY=$DISPLAY [--device /dev/<sound_device> [...]] \
      -v /tmp/.X11-unix:/tmp/.X11-unix -v $XAUTHORITY:/tmp/.host_Xauthority:ro \
      -dti <gui_app_image_name>
      
docker run --name gui_app -e DISPLAY=$DISPLAY --device /dev/snd \
      -v /tmp/.X11-unix:/tmp/.X11-unix -v $XAUTHORITY:/tmp/.host_Xauthority:ro \
      -dti foo/gui_app
      
docker start gui_app

