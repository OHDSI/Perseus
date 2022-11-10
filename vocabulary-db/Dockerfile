FROM --platform=linux/amd64 postgres

ARG INIT_ENV=full

COPY vocabulary tmp/vocabulary
COPY ${INIT_ENV}.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB vocabulary
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD password

EXPOSE 5432