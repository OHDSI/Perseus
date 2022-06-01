#!/usr/bin/env sh
set -eu

envsubst '${NGINX_ENV}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
