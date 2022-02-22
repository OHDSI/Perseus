import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FakeDataParams } from '@models/scan-data/fake-data-params';
import { Observable } from 'rxjs';
import { perseusApiUrl, whiteRabbitApiUrl } from '@app/app.constants';

@Injectable()
export class FakeDataService {

  constructor(private http: HttpClient) {
  }

  generateFakeData(fakeDataSettings: FakeDataParams, userId: string, scanReport: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', scanReport)
    formData.append('settings', JSON.stringify(fakeDataSettings))
    return this.http.post<void>(`${whiteRabbitApiUrl}/fake-data/${userId}`, formData)
  }

  abort(userId: string): Observable<void> {
    return this.http.get<void>(`${whiteRabbitApiUrl}/fake-data/${userId}`)
  }

  getUserSchema(): Observable<string> {
    return this.http.get<string>(`${perseusApiUrl}/get_user_schema_name`)
  }
}
