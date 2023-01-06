import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { ServerErrorInterceptor } from '@interceptors/server-error.interceptor';
import { getAuthInterceptors, getAuthModules } from '@app/app.util'
import { authInjector, authServiceClass } from '@services/auth/auth-injector'
import { authStrategy } from '@app/app.constants'
import { DataConnectionService } from '@app/data-connection/data-connection.service';
import { ApiModule } from './data-connection/api/api.module';
import { environment } from 'src/environments/environment';

export const authModules = getAuthModules()
export const authInterceptors = getAuthInterceptors()

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // ApiModule.forRoot({ rootUrl: environment.dataConnectionRootUrl }),
    AppRoutingModule,
    ...authModules,
  ],
  providers: [
    ...authInterceptors,
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    { provide: authInjector, useClass: authServiceClass(authStrategy)},
    DataConnectionService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
