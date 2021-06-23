import { Observable } from 'rxjs/internal/Observable';
import { JSZipObject } from 'jszip';
import { map } from 'rxjs/operators';
import { MediaType } from '@utils/base64-util';

const readFile = (file: JSZipObject, type: 'blob' | 'string') => new Observable<string | BlobPart>(subscriber => {
  file.async(type).then(
    result => {
      subscriber.next(result)
      subscriber.complete()
    },
    error => subscriber.error(error)
  )
})

export function jZipObjectToFile(zipObject: JSZipObject, inType: 'blob' | 'string', outType: MediaType): Observable<File> {
  return readFile(zipObject, inType)
    .pipe(
      map(content => {
        const blob = new Blob([content], {type: outType});
        return new File([blob], zipObject.name, {type: outType});
      })
    )
}
