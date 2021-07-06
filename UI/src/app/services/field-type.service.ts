import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '@app/app.constants';
import { map } from 'rxjs/operators';
import { FieldType } from '@utils/field-type';

@Injectable({
  providedIn: 'root'
})
export class FieldTypeService {

  constructor(private http: HttpClient) {
  }

  getSimplifiedType(type: string): Observable<FieldType> {
    return this.http.get<string>(`${apiUrl}/get_field_type?type=${type}`)
      .pipe(
        map(result => result === 'char' ? 'string' : result as FieldType)
      )
  }
}
