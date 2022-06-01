FROM nginx

ENV NGINX_ENV=docker

COPY default.conf /etc/nginx/conf.d/default.conf
COPY server.azure.conf /etc/nginx/server.azure.conf
COPY server.docker.conf /etc/nginx/server.docker.conf

EXPOSE 80