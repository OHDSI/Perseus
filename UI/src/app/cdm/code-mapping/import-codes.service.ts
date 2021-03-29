import { Injectable } from '@angular/core';
import { Column } from '../../grid/grid';
import { Observable } from 'rxjs/internal/Observable';
import { map, tap } from 'rxjs/operators';

export interface Code {
  [key: string]: any
}

@Injectable()
export class ImportCodesService {

  csv: File

  codes: Code[]

  columns: Column[]

  constructor() {
  }

  loadCsv(csv: File): Observable<Code[]> {
    return this.readFile(csv)
      .pipe(
        map(text => this.csvTextToJson(text)),
        tap(codes => {
          if (codes.length > 0) {
            this.codes = codes
            this.columns = Object.keys(codes[0]).map(key => ({
              field: key,
              name: key
            }))
          } else {
            throw new Error('Empty csv file')
          }
        })
      )
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
