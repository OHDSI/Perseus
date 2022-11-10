FROM --platform=linux/amd64 nginx

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-server \
    && export ROOTPASS=$(head -c 12 /dev/urandom |base64 -) && echo "root:$ROOTPASS" | chpasswd

COPY sshd_config /etc/ssh/

ENV NGINX_ENV='docker'

COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY server.azure-test.conf /etc/nginx/server.azure-test.conf
COPY server.azure-dev.conf /etc/nginx/server.azure-dev.conf
COPY server.azure-prod.conf /etc/nginx/server.azure-prod.conf
COPY server.docker.conf /etc/nginx/server.docker.conf
COPY docker-entrypoint.sh /

EXPOSE 80 2222

ENTRYPOINT ["/docker-entrypoint.sh"]
