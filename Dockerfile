FROM python:3.6

COPY ./cdm_souffleur /app/cdm_souffleur

COPY ./requirements.txt /app/cdm_souffleur

WORKDIR /app/cdm_souffleur

ENV PYTHONPATH=/app

RUN wget "https://archive.apache.org/dist/lucene/solr/8.8.1/solr-8.8.1.tgz"

RUN tar -xvzf /app/cdm_souffleur/solr-8.8.1.tgz

RUN mkdir /app/cdm_souffleur/solr-8.8.1/contrib/dataimporthandler/lib

RUN mkdir /app/cdm_souffleur/solr-8.8.1/server/solr/concepts

