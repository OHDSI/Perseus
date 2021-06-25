import { WebsocketDirective } from '../websocket.directive';
import { Observable } from 'rxjs/internal/Observable';
import { CdmBuilderService } from '@services/cdm-builder/cdm-builder.service';
import * as SignalR from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr';
import { cdmBuilderLogUrl, isProd } from '@app/app.constants';
import { switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { authInjector } from '@services/auth/auth-injector';
import { AuthService } from '@services/auth/auth.service';

@Injectable()
export class CdmBuilderWebsocketService extends WebsocketDirective implements OnDestroy {

  constructor(private cdmBuilderService: CdmBuilderService,
              @Inject(authInjector) private authService: AuthService) {
    super();
  }

  private hubConnection: SignalR.HubConnection;

  private readonly errorMessage = 'Can not connect to CDM builder service';

  private static createSignalRConnection(token: string) {
    return new SignalR.HubConnectionBuilder()
      .withUrl(`${cdmBuilderLogUrl}?Authorization=${token}`, {
        skipNegotiation: true,
        transport: SignalR.HttpTransportType.WebSockets
      })
      .configureLogging(isProd ? SignalR.LogLevel.None : SignalR.LogLevel.Information)
      .build();
  }

  ngOnDestroy() {
    if (this.hubConnection?.state !== HubConnectionState.Disconnected) {
      this.hubConnection?.stop()
    }
  }

  connect(): Observable<boolean> {
    this.cdmBuilderService.addMapping()
      .pipe(
        switchMap(result => {
          if (result) {
            this.hubConnection = CdmBuilderWebsocketService.createSignalRConnection(this.authService.user.token);
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
