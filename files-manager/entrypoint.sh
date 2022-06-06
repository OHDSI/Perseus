#!/bin/sh

/usr/sbin/sshd -e

java ${JAVA_OPTS} -jar /app.jar ${0} ${@}
