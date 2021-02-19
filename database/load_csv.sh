apt-get update -y
apt-get install unzip wget -y

cd tmp
wget -O vocabulary.zip https://athena.ohdsi.org/api/v1/vocabularies/zip/ea8baa45-19b9-46f5-94f2-becf7bf7a7cd
unzip 'vocabulary.zip' -d vocabulary
rm vocabulary.zip
