FROM postgres 

ARG voc_url="https://athena.ohdsi.org/api/v1/vocabularies/zip/c6d49cb1-d0a1-4ee7-ac2d-43c710994230"
ENV VOC_URL=${voc_url}
COPY vocabulary_download_v5.zip tmp/vocabulary.zip
COPY load_csv.sh load_csv.sh
RUN tr -d '\015' <./load_csv.sh >./load_csv.bash && mv ./load_csv.bash ./load_csv.sh && chmod 770 load_csv.sh
RUN ./load_csv.sh

COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB vocabulary
ENV POSTGRES_PASSWORD password
