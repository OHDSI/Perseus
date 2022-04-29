import { Compiler, Injectable, Injector, Optional, Type } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConnectorService } from '@services/app-connector.service';
import { ServerErrorComponent } from '../server-error/server-error.component';
import { ServerNotRespondingPopupComponent } from '../server-error/server-not-responding-popup/server-not-responding-popup.component';
import { ServerErrorPopupComponent } from '../server-error/server-error-popup/server-error-popup.component';
import { externalUrls, serverErrorExclusionUrls } from '../app.constants';
import { MatDialog } from '@angular/material/dialog'

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  private readonly exclusionUrls = [
    ...externalUrls,
    ...serverErrorExclusionUrls
  ]

  constructor(private appConnector: AppConnectorService,
              private compiler: Compiler,
              private injector: Injector,
              @Optional() private dialogService: MatDialog) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isExclusionUrl = req => this.exclusionUrls.find(url => req.url.includes(url))
    const isNotServerError = error => error.status !== 0 && error.status < 500

    return next.handle(request)
      .pipe(
        catchError(error => {
          if (isNotServerError(error) || isExclusionUrl(request) || this.appConnector.isOpen) {
            throw error
          }
          let Component: Type<ServerErrorComponent>
          import('../server-error/server-error.module')
            .then(({ServerErrorModule}) => {
              Component = ServerErrorModule.getComponent()
              return this.compiler.compileModuleAsync(ServerErrorModule)
            })
            .then(moduleFactory => {
              const moduleRef = moduleFactory.create(this.injector);
              const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(Component);
              this.appConnector.dynamicComponent = {
                componentRef: this.appConnector.viewContainerRef.createComponent(componentFactory),
                payload: error.status === 500 ? ServerErrorPopupComponent : ServerNotRespondingPopupComponent
              }
            })
          throw error
        })
      );
  }
}
