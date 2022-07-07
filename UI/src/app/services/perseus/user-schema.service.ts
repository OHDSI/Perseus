import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { perseusApiUrl } from '@app/app.constants'

@Injectable({
  providedIn: 'root'
})
export class UserSchemaService {

  constructor(private http: HttpClient) { }

  getUserSchema(): Observable<string> {
    return this.http.get<string>(`${perseusApiUrl}/get_user_schema_name`)
  }
}
