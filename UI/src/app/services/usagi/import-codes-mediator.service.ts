import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  private connectRequest$: Observable<void>

  private abortRequest$: Observable<void>

  get onWebsocketConnect$(): Observable<void> {
    return this.connectRequest$
  }

  set onWebsocketConnect$(request$: Observable<void>) {
    this.connectRequest$ = request$
  }

  get consoleHeader(): ConsoleHeader {
    return this.scanConsoleHeader
  }

  set consoleHeader(value: ConsoleHeader) {
    this.scanConsoleHeader = value
  }

  get onAbort$(): Observable<void> {
    return this.abortRequest$
  }

  set onAbort$(value: Observable<void>) {
    this.abortRequest$ = value
  }
}
