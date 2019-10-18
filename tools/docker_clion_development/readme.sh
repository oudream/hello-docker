
### https://austinmorlan.com/posts/docker_clion_development/

docker build -t docker-remote-dev ./docker-remote-dev/.


docker-compose up -d


# Go to File -> Settings -> Build, Execution, Deployment -> Toolchains.
# Add a new toolchain named Docker, set it to Remote Host, and configure
# the credentials using the three dots to the right of the field (username: dev password: dev).

#Go to File -> Settings -> Build, Execution, Deployment -> CMake.
# Add a new profile and name it Debug-Remote. Set the toolchain to our previously
# created Docker toolchain.

#Go to File -> Settings -> Build, Execution, Deployment -> Deployment.
#Select the existing Docker entry and fill out the information if it isn’t already there.
# Ensure the Root path is set to /.

#Go to the Mappings tab and set your local project directory to be mapped to a directory in the container.

#We need to do two more things to ensure that we’re able to run an X11 application in the container.
# In a shell on your host, run echo $DISPLAY and note the output. It’s probably :0 but could be something else.
# Then select Edit Configurations from the same build configuration dropdown in CLion and add DISPLAY=:0
# (or whatever the output was) to the list of environment variables. This connects the display of our host to the display of the container.

