#!/bin/bash

PAT=$1
#/bin/echo ${PAT}
PAT64=$(printf "%s"":${PAT}" | base64)
#/bin/echo ${PAT64}

git -c http.extraHeader="Authorization: Basic ${PAT64}" clone https://dev.arcadia.spb.ru/Arcadia-CDM/Perseus/_git/vocabulary
