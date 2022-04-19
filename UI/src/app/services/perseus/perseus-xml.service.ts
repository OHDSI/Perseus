import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { EtlMappingForZipXmlGeneration } from '@models/etl-mapping-for-zip-xml-generation'
import { Observable } from 'rxjs'
import { createNoCacheHeaders } from '@utils/http-headers'
import { map } from 'rxjs/operators'
import { perseusApiUrl } from '@app/app.constants'

@Injectable({
  providedIn: 'root'
})
export class PerseusXmlService {

  constructor(private http: HttpClient) { }

  getXmlPreview(mapping: EtlMappingForZipXmlGeneration): Observable<any> {
    return this.http.post(`${perseusApiUrl}/xml_preview`, mapping);
  }

  generateZipXml(name: string, mapping: EtlMappingForZipXmlGeneration): Observable<File> {
    const headers = createNoCacheHeaders()
    return this.http.post(`${perseusApiUrl}/generate_zip_xml`, mapping, {headers, responseType: 'blob'})
      .pipe(
        map(blob => new File([blob], `${name}-xml.zip`))
      )
  }
}
