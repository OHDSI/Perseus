FROM --platform=linux/amd64 swaggerapi/swagger-ui

ENV BASE_URL=/swagger
ENV URLS_PRIMARY_NAME=White-Rabbit
ENV URLS="[ \
  { url: 'docs/white-rabbit.yml', name: 'White-Rabbit' } \
  , { url: 'docs/data-quality-dashboard.yml', name: 'Data-Quality-Dashboard' } \
]"

COPY white-rabbit.yml /usr/share/nginx/html/docs/
COPY data-quality-dashboard.yml /usr/share/nginx/html/docs/

EXPOSE 8080