import { Injectable } from '@angular/core';
import { Column } from '../../grid/grid';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
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
    formData.append('delimeter', delimeter)

    return this.httpClient.post<{[key: string]: string[]}>(`${apiUrl}/load_codes_to_server`, formData)
      .pipe(
        map(result => {
          const keys = Object.keys(result)
          if (keys.length === 0) {
            throw new Error('Empty csv file')
          }

          this.columns = keys.map(key => ({
            field: key,
            name: key
          }))

          const firstColumnValues = result[keys[0]]
          this.codes = firstColumnValues.map((value, index) => {
            const code: Code = {}
            keys.forEach(key => code[key] = result[key][index])
            return code
          })

          return this.codes
        })
      )
  }

  reset() {
    this.csv = null
    this.codes = null
    this.columns = null
  }

  private readFile(file: File): Observable<string> {
    const fileReader = new FileReader()

    return new Observable<string>(subscriber => {
      fileReader.onload = (event: ProgressEvent) => {
        const text = (event.target as any).result
        subscriber.next(text);
        subscriber.complete();
      }

      fileReader.onerror = error => {
        subscriber.error(error);
      }

      fileReader.readAsText(file)
    });
  }

  private csvTextToJson(csv: string): Code[] {
    const separator = ','
    const resultJsonArray = []
    const lines = csv.split('\n')
    const keys = lines
      .shift()
      .split(separator)
      .map(key => key.trim())

    if (lines[lines.length - 1] === '') {
      lines.pop()
    }

    lines.forEach(line => {
      const jsonValue = {}
      line.split(separator).forEach((value, index) =>
        jsonValue[keys[index]] = value
      )
      resultJsonArray.push(jsonValue)
    })

    return resultJsonArray
  }
}
