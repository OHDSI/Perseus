import { Observable } from 'rxjs';

export async function base64ToBlob(base64: string): Promise<Blob> {
  const response = await fetch(base64);
  return await response.blob();
}

export async function base64ToFile(base64: string, fileName: string): Promise<File> {
  const blob = await base64ToBlob(base64) as File;
  return new File([blob], fileName);
}

export function base64ToFileAsObservable(base64: string, fileName: string): Observable<File> {
  return new Observable<File>(subscriber => {
    base64ToFile(base64, fileName)
      .then(file => {
        subscriber.next(file);
        subscriber.complete();
      })
      .catch(error =>
        subscriber.error(error)
      );
  });
}

export enum MediaType {
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export function getBase64Header(mediaType: string): string {
  return `data:${mediaType};base64,`;
}
