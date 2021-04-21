import { WebsocketService } from '../websocket.service';
import { Observable } from 'rxjs/internal/Observable';
import { CdmBuilderService } from '../../services/cdm-builder/cdm-builder.service';
import * as SignalR from '@microsoft/signalr';
import { cdmBuilderLogUrl, isProd } from '../../app.constants';
import { switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Injectable()
export class CdmBuilderWebsocketService extends WebsocketService {

  constructor(private cdmBuilderService: CdmBuilderService) {
    super();
  }

  private hubConnection: SignalR.HubConnection;

  private readonly errorMessage = 'Can not connect to CDM builder service';

  private static createSignalRConnection() {
    return new SignalR.HubConnectionBuilder()
      .withUrl(cdmBuilderLogUrl, {
        skipNegotiation: true,
        transport: SignalR.HttpTransportType.WebSockets
      })
      .configureLogging(isProd ? SignalR.LogLevel.None : SignalR.LogLevel.Information)
      .build();
  }

  connect(): Observable<boolean> {
    this.cdmBuilderService.addMapping()
      .pipe(
        switchMap(result => {
          if (result) {
            this.hubConnection = CdmBuilderWebsocketService.createSignalRConnection();
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

  on(): Observable<any> {
    return new Observable<string>(subscriber => {
      this.hubConnection.on('Log', message => {
        subscriber.next(message);
      });
    });
  }

  send(data: string | any): void {
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
}
