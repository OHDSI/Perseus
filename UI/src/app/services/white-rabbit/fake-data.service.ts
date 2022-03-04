import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FakeDataSettings } from '@models/white-rabbit/fake-data-settings';
import { Observable } from 'rxjs';
import { whiteRabbitApiUrl } from '@app/app.constants';
import { Conversion } from '@models/conversion/conversion'

@Injectable()
export class FakeDataService {

  constructor(private http: HttpClient) {
  }

  generateFakeData(settings: FakeDataSettings, scanReport: File): Observable<Conversion> {
    const formData = new FormData();
    formData.append('file', scanReport)
    formData.append('settings', JSON.stringify(settings))
    return this.http.post<Conversion>(`${whiteRabbitApiUrl}/fake-data`, formData)
  }

  conversionInfoWithLogs(conversionId: number): Observable<Conversion> {
    return this.http.get<Conversion>(`${whiteRabbitApiUrl}/fake-data/conversion/${conversionId}`)
  }

  abort(conversionId: number): Observable<void> {
    return this.http.get<void>(`${whiteRabbitApiUrl}/fake-data/abort/${conversionId}`)
  }
}
