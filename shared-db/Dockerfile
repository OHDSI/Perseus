FROM postgres

COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD password
ENV POSTGRES_DB shared
ENV PGDATA /data/postgres

EXPOSE 5432