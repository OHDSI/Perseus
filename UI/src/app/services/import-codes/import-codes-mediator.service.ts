import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

/**
 * Used for set http request in code-mapping websocket service
 */
@Injectable()
export class ImportCodesMediatorService {

  /**
   * Can be importCodesService.calculateScore or importVocabulariesService.prepareVocabulary
   */
  private request$: Observable<void>

  get onWebsocketConnect$(): Observable<void> {
    return this.request$
  }

  set onWebsocketConnect$(request$: Observable<void>) {
    this.request$ = request$
  }
}
