import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class RulesPopupService {
  get deleteConnector$(): Observable<any> {
    return this.deleteSubject.asObservable();
  }

  private deleteSubject = new Subject<any>();

  deleteConnector() {
    this.deleteSubject.next();
  }
}
