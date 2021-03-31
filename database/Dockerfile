FROM postgres 

# Install csv files
ENV VOC_URL="https://athena.ohdsi.org/api/v1/vocabularies/zip/0f85a705-2000-4934-8b1a-5dcb77492071"
COPY load_csv.sh load_csv.sh
RUN chmod 770 load_csv.sh
RUN ./load_csv.sh

COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB cdm_souffleur
ENV POSTGRES_PASSWORD 5eC_DkMr^3
