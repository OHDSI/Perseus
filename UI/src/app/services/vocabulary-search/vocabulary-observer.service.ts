import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface ValueWrapper {
  value: boolean;
  emit: boolean
}

@Injectable()
export class VocabularyObserverService {

  private showVocabulary$ = new BehaviorSubject<ValueWrapper>({
    value: false,
    emit: false,
  });

  get show$(): Observable<boolean> {
    return this.showVocabulary$.asObservable()
      .pipe(
        filter(obj => obj.emit),
        map(obj => obj.value)
      );
  }

  get show(): boolean {
    return this.showVocabulary$.getValue().value;
  }

  set show(value: boolean) {
    this.showVocabulary$.next({
      value,
      emit: true
    });
  }

  next(value: boolean | ValueWrapper) {
    if (typeof value === 'boolean') {
      this.showVocabulary$.next({
        value,
        emit: true
      });
    } else {
      this.showVocabulary$.next(value)
    }
  }
}
