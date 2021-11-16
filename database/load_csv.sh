apt-get update -y
apt-get install unzip wget -y

cd tmp

if [ -z "$VOC_URL" ]; then
  echo "Using default vocabulary"
  sleep 1
  unzip 'vocabulary.zip' -d vocabulary
	rm vocabulary.zip
else
  rm vocabulary.zip
  echo "Downloading vocabulary by link..."
  sleep 1
  wget -O vocabulary.zip "$VOC_URL"

  # Archive not empty
  if zipinfo vocabulary.zip > /dev/null; then
    echo "Successfully downloaded"
    echo "Unzipping..."
    sleep 1
    unzip 'vocabulary.zip' -d vocabulary
    rm vocabulary.zip
    echo "Vocabulary successfully downloaded and unzipped"
  else
    echo "Vocabulary link incorrect or expired"
    exit 1
  fi
fi