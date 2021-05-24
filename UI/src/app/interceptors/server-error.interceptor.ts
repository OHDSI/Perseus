import { Compiler, Injectable, Injector, Type } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConnectorService } from '../services/app-connector.service';
import { ServerErrorComponent } from '../server-error/server-error.component';
import { ServerNotRespondingPopupComponent } from '../server-error/server-not-responding-popup/server-not-responding-popup.component';
import { ServerErrorPopupComponent } from '../server-error/server-error-popup/server-error-popup.component';
import { externalUrls, serverErrorExclusionUrls } from '../app.constants';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  private readonly exclusionUrls = [
    ...externalUrls,
    ...serverErrorExclusionUrls
  ]

  constructor(private appConnector: AppConnectorService,
              private compiler: Compiler,
              private injector: Injector) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError(error => {
          if ((error.status !== 0 && error.status < 500) || this.exclusionUrls.find(url => request.url.includes(url))) {
            throw error
          }

          if (this.appConnector.isOpen) {
            return EMPTY
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
          return EMPTY
        })
      );
  }
}
