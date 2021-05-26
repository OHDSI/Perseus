import { Inject, Injectable } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Observable } from 'rxjs/internal/Observable';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/socket';
import { AuthService } from '../../services/auth/auth.service';
import { authInjector } from '../../services/auth/auth-injector';
import { serverUrl } from '../../app.constants';
import { ImportCodesMediatorService } from '../../services/import-codes/import-codes-mediator.service';

@Injectable()
export class CodeMappingWebsocketService extends WebsocketService {

  socket: Socket

  constructor(@Inject(authInjector) private authService: AuthService,
              private importCodesMediatorService: ImportCodesMediatorService) {
    super();
  }

  connect(): Observable<boolean> {
    this.socket = io(serverUrl, {query: {token: this.authService.user.token}, reconnection: false})
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
