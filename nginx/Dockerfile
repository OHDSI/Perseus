FROM nginx

ENV NGINX_ENV='docker'

COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY server.azure.conf /etc/nginx/server.azure.conf
COPY server.docker.conf /etc/nginx/server.docker.conf
COPY docker-entrypoint.sh /

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
