apt-get update -y
apt-get install unzip wget -y

cd root
wget -O vocabulary.zip https://athena.ohdsi.org/api/v1/vocabularies/zip/1feaa758-e249-4ddc-85e4-0c489b8e20a7
unzip 'vocabulary.zip' -d vocabulary
rm vocabulary.zip