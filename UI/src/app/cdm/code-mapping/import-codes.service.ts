import { Injectable } from '@angular/core';
import { Column } from '../../grid/grid';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class ImportCodesService {

  csv: File

  data: { [key: string]: any }[]

  columns: Column[]

  constructor() {
  }

  loadCsv(csv: File) {
    this.readFile(csv).subscribe(text => {
      const jsonArray = this.csvTextToJson(text)
      console.log(jsonArray)
    })
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

  private csvTextToJson(csv: string): {[key: string]: any}[] {
    const separator = ','
    const lines = csv.split('\n')
    const keys = lines.shift().split(separator)
    const resultJsonArray = []

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
