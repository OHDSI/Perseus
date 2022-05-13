FROM postgres

COPY vocabulary tmp/
COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB vocabulary
ENV POSTGRES_PASSWORD password
