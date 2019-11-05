@echo off

javac "%~dp0Todo.java" -encoding UTF-8 -d .
java "%~dp0Todo" %1 %2 %3

REM javac "%~dp0Todo.java" -encoding UTF-8
REM java -classpath "%~dp0" Todo %1 %2 %3
