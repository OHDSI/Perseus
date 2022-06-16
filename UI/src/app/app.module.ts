import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { ServerErrorInterceptor } from '@interceptors/server-error.interceptor';
import { getAuthInterceptors, getAuthModules } from '@app/app.util'

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
    AppRoutingModule,
    ...authModules
  ],
  providers: [
    ...authInterceptors,
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
