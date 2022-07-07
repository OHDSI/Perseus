export function blobToObj<T>(blob: Blob): Promise<T> {
  const reader: FileReader = new FileReader();
  reader.readAsText(blob);
  return new Promise<T>((resolve, reject) => {
    reader.onloadend = () => {
      try {
        const resultAsString = reader.result as string;
        resolve(JSON.parse(resultAsString));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = error => reject(error);
  });
}
