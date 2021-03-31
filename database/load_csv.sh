apt-get update -y
apt-get install unzip wget -y

cd tmp
wget -O vocabulary.zip $VOC_URL
unzip 'vocabulary.zip' -d vocabulary
rm vocabulary.zip
