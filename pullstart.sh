#!/bin/bash

WORKDIR=$(pwd)

docker-compose pull
docker-compose up -d

exit 0
