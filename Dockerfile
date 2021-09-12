FROM python:3.6

COPY ./cdm_souffleur /app/cdm_souffleur

COPY ./requirements.txt /app/cdm_souffleur

WORKDIR /app/cdm_souffleur

ENV PYTHONPATH=/app

RUN apt-get update && apt-get install -y openjdk-11-jdk

RUN wget "https://archive.apache.org/dist/lucene/solr/8.8.1/solr-8.8.1.tgz"

RUN tar -xvzf /app/cdm_souffleur/solr-8.8.1.tgz

RUN mkdir /app/cdm_souffleur/solr-8.8.1/contrib/dataimporthandler/lib

RUN mkdir /app/cdm_souffleur/solr-8.8.1/server/solr/concepts

RUN mkdir /app/cdm_souffleur/solr-8.8.1/server/solr/athena

COPY ./solr/postgresql-42.2.19.jar /app/cdm_souffleur/solr-8.8.1/contrib/dataimporthandler/lib

COPY ./solr/concepts /app/cdm_souffleur/solr-8.8.1/server/solr/concepts

COPY ./solr/athena /app/cdm_souffleur/solr-8.8.1/server/solr/athena

RUN su

RUN apt-get install sudo

RUN sudo apt-get install lsof

RUN pip install -r requirements.txt

ENV PATH="/app/cdm_souffleur/solr-8.8.1/bin:${PATH}"

RUN mkdir /app/cdm_souffleur/model/generate

RUN mkdir /app/cdm_souffleur/model/generate/Definitions

CMD solr start -force -p 8984 ; python /app/cdm_souffleur/rest_api.py

