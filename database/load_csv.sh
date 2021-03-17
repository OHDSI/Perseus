apt-get update -y
apt-get install unzip wget -y

cd tmp
wget -O vocabulary.zip https://athena.ohdsi.org/api/v1/vocabularies/zip/0f85a705-2000-4934-8b1a-5dcb77492071
unzip 'vocabulary.zip' -d vocabulary
rm vocabulary.zip
