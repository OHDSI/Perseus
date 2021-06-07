import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ConsoleHeader } from '@models/code-mapping/console-header';

/**
 * Used for set http request in code-mapping websocket service
 */
@Injectable()
export class ImportCodesMediatorService {

  private scanConsoleHeader: ConsoleHeader

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

  get consoleHeader(): ConsoleHeader {
    return this.scanConsoleHeader
  }

  set consoleHeader(value: ConsoleHeader) {
    this.scanConsoleHeader = value
  }
}
