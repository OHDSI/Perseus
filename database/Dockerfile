FROM postgres 

# Install csv files
COPY load_csv.sh load_csv.sh
RUN chmod 770 load_csv.sh
RUN ./load_csv.sh

COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB cdm_souffleur
ENV POSTGRES_PASSWORD 5eC_DkMr^3
