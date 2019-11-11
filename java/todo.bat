@echo off

SET here=%~dp0

del %here%Todo.class
del %here%Todo$1.class
del %here%Todo$Task.class

javac "%here%Todo.java" -encoding UTF-8 -d "%here:~0,-1%"

java --class-path "%here:~0,-1%" Todo %1 %2 %3
