#!/bin/sh

/etc/init.d/ssh start

java ${JAVA_OPTS} -jar /app.jar ${0} ${@}