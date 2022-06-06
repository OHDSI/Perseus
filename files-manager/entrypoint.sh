#!/bin/sh

/usr/sbin/sshd -De

java ${JAVA_OPTS} -jar /app.jar ${0} ${@}
