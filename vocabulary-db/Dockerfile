FROM postgres

COPY vocabulary tmp/vocabulary
COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB vocabulary
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD password

EXPOSE 5432