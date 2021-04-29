import { Injectable } from '@angular/core';
import { Column } from '../../grid/grid';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../app.constants';

export interface Code {
  selected?: boolean
  [key: string]: any
}

@Injectable()
export class ImportCodesService {

  csv: File

  codes: Code[]

  columns: Column[]

  constructor(private httpClient: HttpClient) {
  }

  get imported(): boolean {
    return !!this.codes && !!this.columns
  }

  loadCsv(csv: File, delimeter = ','): Observable<Code[]> {
    const formData = new FormData()
    formData.append('file', csv)
    formData.append('delimiter', delimeter)

    return this.httpClient.post<Code[]>(`${apiUrl}/load_codes_to_server`, formData)
      .pipe(
        tap(codes => {
          if (codes.length === 0) {
            throw new Error('Empty csv file')
          }
          this.codes = codes
          this.columns = Object.keys(codes[0]).map(key => ({
            field: key,
            name: key
          }))
        })
      )
  }

  reset() {
    this.csv = null
    this.codes = null
    this.columns = null
  }
}
