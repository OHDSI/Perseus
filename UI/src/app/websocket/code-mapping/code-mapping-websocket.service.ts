import { Inject, Injectable } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Observable } from 'rxjs/internal/Observable';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/socket';
import { AuthService } from '../../services/auth/auth.service';
import { authInjector } from '../../services/auth/auth-injector';
import { serverUrl } from '../../app.constants';

@Injectable()
export class CodeMappingWebsocketService extends WebsocketService {

  socket: Socket

  constructor(@Inject(authInjector) private authService: AuthService) {
    super();
  }

  connect(): Observable<boolean> {
    this.socket = io(serverUrl, {query: {token: this.authService.user.token}, reconnection: false})
    this.socket.connect()

    this.socket.on('connect', () => this.connection$.next(true))

    this.socket.on('disconnect', () => this.connection$.complete)

    this.socket.on('error', error => this.connection$.error(error))

    return this.status$
  }

  disconnect(): void {
    this.socket.disconnect()
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
