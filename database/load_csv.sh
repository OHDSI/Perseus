apt-get update -y
apt-get install unzip wget -y

cd tmp
wget -O vocabulary.zip $VOC_URL

# Archive not empty
if zipinfo vocabulary.zip > /dev/null; then
	unzip 'vocabulary.zip' -d vocabulary
	rm vocabulary.zip
else
	echo "Vocabulary link expired"
	exit 1
fi