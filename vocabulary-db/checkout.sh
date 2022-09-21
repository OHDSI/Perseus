#!/bin/bash

SCRIPT_PATH=`echo "$(dirname -- "$(readlink -f "${BASH_SOURCE}")")"`
echo $SCRIPT_PATH && cd $SCRIPT_PATH

PAT=$1
PAT64=`printf "%s"":${PAT}" | base64`

git -c http.extraHeader="Authorization: Basic ${PAT64}" clone https://dev.arcadia.spb.ru/Arcadia-CDM/Perseus/_git/vocabulary
