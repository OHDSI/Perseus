FROM solr

COPY athena /opt/solr/server/solr/configsets/athena
COPY postgresql-42.2.19.jar /opt/solr/dist/postgresql-42.2.19.jar

EXPOSE 8983

ENTRYPOINT ["solr-precreate", "athena", "/opt/solr/server/solr/configsets/athena/conf"]