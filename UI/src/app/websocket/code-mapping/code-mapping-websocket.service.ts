import { Inject, Injectable } from '@angular/core';
import { WebsocketService } from '../websocketService';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '@services/auth/auth.service';
import { authInjector } from '@services/auth/auth-injector';
import { usagiWsUrl } from '@app/app.constants';
import { ImportCodesMediatorService } from '@services/usagi/import-codes-mediator.service';

@Injectable()
export class CodeMappingWebsocketService extends WebsocketService {

  socket: Socket

  constructor(@Inject(authInjector) private authService: AuthService,
              private importCodesMediatorService: ImportCodesMediatorService) {
    super();
  }

  connect(): Observable<boolean> {
    this.socket = io(usagiWsUrl, {
      query: {token: this.authService.user.token},
      reconnection: false
    })
    this.socket.connect()

    const errorHandler = error => this.connection$.error(error)

    this.socket.on('connect', () => {
      this.importCodesMediatorService.onWebsocketConnect$
        .subscribe(
          () => this.connection$.next(true),
          error => this.connection$.error(error)
        )
    })
    this.socket.on('error', errorHandler)
    this.socket.on('connect_failed', errorHandler)
    this.socket.on('connect_error', errorHandler)
    this.socket.on('disconnect', () => this.connection$.complete)

    return this.status$
  }

  disconnect(): void {
    if (this.socket.active) {
      this.socket.disconnect()
    }
  }

  on(): Observable<string> {
    return new Observable(subscriber => {
      this.socket.on('import_codes_status', message =>
        subscriber.next(message)
      )
    })
  }

  send(data: any): void {
  }
}
