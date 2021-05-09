FROM python:3.6

COPY ./cdm_souffleur /app/cdm_souffleur

COPY ./requirements.txt /app/cdm_souffleur

WORKDIR /app/cdm_souffleur

ENV PYTHONPATH=/app

RUN wget "https://archive.apache.org/dist/lucene/solr/8.8.1/solr-8.8.1.tgz"

RUN tar -xvzf /app/cdm_souffleur/solr-8.8.1.tgz

RUN mkdir /app/cdm_souffleur/solr-8.8.1/contrib/dataimporthandler/lib

RUN mkdir /app/cdm_souffleur/solr-8.8.1/server/solr/concepts

COPY ./solr/postgresql-42.2.19.jar /app/cdm_souffleur/solr-8.8.1/contrib/dataimporthandler/lib

COPY ./solr/concepts/conf  /app/cdm_souffleur/solr-8.8.1/server/solr/concepts

RUN /app/cdm_souffleur/solr-8.8.1/bin/solr start

RUN pip install -r requirements.txt

RUN mkdir /app/cdm_souffleur/model/generate

RUN mkdir /app/cdm_souffleur/model/generate/Definitions

CMD ["python", "rest_api.py"]

