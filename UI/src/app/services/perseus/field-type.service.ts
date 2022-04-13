import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { perseusApiUrl } from '@app/app.constants';
import { map } from 'rxjs/operators';
import { FieldType } from '@utils/field-type';

@Injectable({
  providedIn: 'root'
})
export class FieldTypeService {

  constructor(private http: HttpClient) {
  }

  getSimplifiedType(type: string): Observable<FieldType> {
    return this.http.get<string>(`${perseusApiUrl}/get_field_type?type=${type}`)
      .pipe(
        map(result => result === 'char' ? 'string' : result as FieldType)
      )
  }
}
