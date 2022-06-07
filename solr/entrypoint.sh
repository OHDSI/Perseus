#!/bin/bash

service ssh start
runuser -u solr -- solr-precreate athena /opt/solr/server/solr/configsets/athena/conf