#!/bin/bash

service ssh start
exec nginx -g 'daemon off;'
