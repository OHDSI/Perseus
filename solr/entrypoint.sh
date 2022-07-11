#!/bin/bash

service ssh start
runuser -u solr -- precreate-core athena /opt/solr/server/solr/configsets/athena/conf
runuser -u solr -- solr-precreate usagi /opt/solr/server/solr/configsets/usagi/conf