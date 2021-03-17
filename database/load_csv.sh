apt-get update -y
apt-get install unzip wget -y

cd tmp
wget -O vocabulary.zip https://athena.ohdsi.org/api/v1/vocabularies/zip/73484d62-6688-4abe-a3e8-55a0f204c6cc
unzip 'vocabulary.zip' -d vocabulary
rm vocabulary.zip
