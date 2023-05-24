#!/bin/bash

TFS_HOST="dev.azure.com"
TFS_COLLECTION="Softwarecountry-JNJ"
TFS_PROJECT="Perseus"

SCRIPT_PATH=`echo "$(dirname -- "$(readlink -f "${BASH_SOURCE}")")"`
echo $SCRIPT_PATH && cd $SCRIPT_PATH

PAT=$1
PAT64=`printf "%s"":${PAT}" | base64`

git -c http.extraHeader="Authorization: Basic ${PAT64}" clone https://${TFS_HOST}/${TFS_COLLECTION}/${TFS_PROJECT}/_git/vocabulary
