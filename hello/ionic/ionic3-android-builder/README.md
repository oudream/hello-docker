# ionic3-android-builder
## Simple container for building ionic 3 android builds
## Build Image
docker build --no-cache -t ionic3-android-builder .

## Run
docker run -v /myApp:/build smartideasllc/ionic3-adroid-builder /bin/bash -c "npm install; ionic cordova build android --prod"
