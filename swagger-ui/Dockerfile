FROM swaggerapi/swagger-ui

ENV BASE_URL=/swagger
ENV URLS_PRIMARY_NAME=White-Rabbit
ENV URLS="[ \
  { url: 'docs/white-rabbit.yml', name: 'White-Rabbit' } \
  , { url: 'docs/data-quality-dashboard.yml', name: 'Data-Quality-Dashboard' } \
]"

RUN apk update \
    && apk add openssh-server \
    && export ROOTPASS=$(head -c 12 /dev/urandom |base64 -) && echo "root:$ROOTPASS" | chpasswd

COPY white-rabbit.yml /usr/share/nginx/html/docs/
COPY data-quality-dashboard.yml /usr/share/nginx/html/docs/

COPY sshd_config /etc/ssh/
COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 8080 2222

ENTRYPOINT ["./entrypoint.sh"]