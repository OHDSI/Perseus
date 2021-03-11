import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class RulesPopupService {
  get deleteConnector$(): Observable<string> {
    return this.deleteSubject.asObservable();
  }

  private deleteSubject = new Subject<string>();

  deleteConnector(key: string) {
    this.deleteSubject.next(key);
  }
}
