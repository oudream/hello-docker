cmake_minimum_required(VERSION 3.0)

project(hello)

find_package(Qt5 REQUIRED COMPONENTS Widgets)

add_executable(hello Main.cpp)

target_link_libraries(hello Qt5::Widgets)