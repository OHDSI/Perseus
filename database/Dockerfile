FROM postgres 

# Install csv files
ARG voc_url=""
ENV VOC_URL=${voc_url}
COPY vocabulary_download_v5.zip tmp/vocabulary.zip
COPY load_csv.sh load_csv.sh
RUN tr -d '\015' <./load_csv.sh >./load_csv.bash && mv ./load_csv.bash ./load_csv.sh && chmod 770 load_csv.sh
RUN ./load_csv.sh

COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB cdm_souffleur
ENV POSTGRES_PASSWORD 5eC_DkMr^3
