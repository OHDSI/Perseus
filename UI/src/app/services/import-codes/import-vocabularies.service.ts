import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface Vocabulary {
  name: string
}

const vocabularies = []

@Injectable()
export class ImportVocabulariesService {

  state: Vocabulary[]

  constructor() { }

  get vocabularies() {
    return this.state
  }

  all(): Observable<Vocabulary[]> {
    return of(vocabularies)
      .pipe(
        delay(3000),
        tap(result => this.state = result)
      )
  }

  get(name: string): Observable<Vocabulary> {
    return of(vocabularies.find(vocabulary => vocabulary.name === name))
  }

  remove(name: string): Observable<void> {
    this.state = this.state.filter(vocabulary => vocabulary.name !== name)
    return of(null)
      .pipe(
        delay(2500)
      )
  }
}
