#!/bin/bash

SCRIPT_PATH=`echo "$(dirname -- "$(readlink -f "${BASH_SOURCE}")")"`
echo "${SCRIPT_PATH}" && cd "${SCRIPT_PATH}" && pwd

VOCABULARY_USER="vocabulary"
VOCABULARY_PASS="password"
SOLR_HOST="$1"
SOLR_PORT="8983"
DB_HOST="$1"
DB_PORT="5432"


# -----------------------------------------
# Create indexs: ATHENA
# -----------------------------------------
function create_indexs_athena() {
    ######
    echo "---"
    echo "Create indexs: ATHENA"
    echo "---"
    curl -s "http://${SOLR_HOST}:${SOLR_PORT}/solr/athena/dataimport?command=full-import&jdbcurl=jdbc:postgresql://${DB_HOST}:${DB_PORT}/vocabulary&jdbcuser=${VOCABULARY_USER}&jdbcpassword=${VOCABULARY_PASS}" | jq .
}

# -----------------------------------------
# Check process: ATHENA
# -----------------------------------------
function check_process_athena() {
    ######
    echo "---"
    echo "Check process: ATHENA"
    echo "---"
    curl -s "http://${SOLR_HOST}:${SOLR_PORT}/solr/athena/dataimport?command=status&indent=on&wt=json" | jq .
    STATUS=`curl -s "http://${SOLR_HOST}:${SOLR_PORT}/solr/athena/dataimport?command=status&indent=on&wt=json" | jq .status | tr -d '"'`
    while [ "${STATUS}" == "busy" ]; do
        sleep 60;
        STATUS=`curl -s "http://${SOLR_HOST}:${SOLR_PORT}/solr/athena/dataimport?command=status&indent=on&wt=json" | jq .status | tr -d '"'`
        curl -s "http://${SOLR_HOST}:${SOLR_PORT}/solr/athena/dataimport?command=status&indent=on&wt=json" | jq .statusMessages | tr -d ','
    done
    echo "ATHENA indexes DONE"
}

# -----------------------------------------
# Create indexs: USAGI
# -----------------------------------------
function create_indexs_usagi() {
    ######
    echo "---"
    echo "Create indexs: USAGI"
    echo "---"
    curl -s "http://${SOLR_HOST}:${SOLR_PORT}/solr/usagi/dataimport?command=full-import&jdbcurl=jdbc:postgresql://${DB_HOST}:${DB_PORT}/vocabulary&jdbcuser=${VOCABULARY_USER}&jdbcpassword=${VOCABULARY_PASS}" | jq .
}

# -----------------------------------------
# Check process: USAGI
# -----------------------------------------
function check_process_usagi() {
    ######
    echo "---"
    echo "Check process: USAGI"
    echo "---"
    curl -s "http://${SOLR_HOST}:${SOLR_PORT}/solr/usagi/dataimport?command=status&indent=on&wt=json" | jq .
    STATUS=`curl -s "http://${SOLR_HOST}:${SOLR_PORT}/solr/usagi/dataimport?command=status&indent=on&wt=json" | jq .status | tr -d '"'`
    while [ "${STATUS}" == "busy" ]; do
        sleep 60;
        STATUS=`curl -s "http://${SOLR_HOST}:${SOLR_PORT}/solr/usagi/dataimport?command=status&indent=on&wt=json" | jq .status | tr -d '"'`
        curl -s "http://${SOLR_HOST}:${SOLR_PORT}/solr/usagi/dataimport?command=status&indent=on&wt=json" | jq .statusMessages | tr -d ','
    done
    echo "USAGI indexes DONE"
}


# -----------------------------------------
# RUN Functions
# -----------------------------------------

create_indexs_athena;
check_process_athena;
create_indexs_usagi;
check_process_usagi;
