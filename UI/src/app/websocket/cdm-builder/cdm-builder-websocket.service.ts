import { WebsocketService } from '../webscoket.service';
import { Observable } from 'rxjs/internal/Observable';
import { WebsocketConfig } from '../websocket.config';
import { CdmBuilderService } from '../../services/cdm-builder.service';
import * as SignalR from '@microsoft/signalr';
import { isProd } from '../../app.constants';
import { switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Injectable()
export class CdmBuilderWebsocketService extends WebsocketService {

  private websocketConfig: WebsocketConfig;

  private hubConnection: SignalR.HubConnection;

  private errorMessage = 'Can not connect to CDM builder service';

  constructor(private cdmBuilderService: CdmBuilderService) {
    super();
  }

  connect(config: WebsocketConfig): Observable<boolean> {
    this.websocketConfig = config;

    this.cdmBuilderService.addMapping()
      .pipe(
        switchMap(result => {
          if (result) {
            this.hubConnection = this.createSignalRConnection();
            return fromPromise(this.hubConnection.start());
          } else {
            throw new Error(this.errorMessage);
          }
        })
      )
      .subscribe(
        () => this.connection$.next(true),
        error => this.connection$.error(error)
      );

    return this.status$;
  }

  on(destination: string): Observable<any> {
    return new Observable<string>(subscriber => {
      this.hubConnection.on(destination, message => {
        subscriber.next(message);
      });
    });
  }

  send(destination: string, data: string | any): void {
    this.cdmBuilderService.convert(data)
      .subscribe(result => this.connection$.next(result));
  }

  disconnect(): void {
    const stopConnection$ = fromPromise(this.hubConnection.stop());
    const abort$ = this.cdmBuilderService.abort();

    forkJoin([stopConnection$, abort$])
      .subscribe(() => {
        this.connection$.next(false);
        this.connection$.complete();
      });
  }

  private createSignalRConnection() {
    return new SignalR.HubConnectionBuilder()
      .withUrl(this.websocketConfig.url, {
        skipNegotiation: true,
        transport: SignalR.HttpTransportType.WebSockets
      })
      .configureLogging(isProd ? SignalR.LogLevel.None : SignalR.LogLevel.Information)
      .build();
  }
}
