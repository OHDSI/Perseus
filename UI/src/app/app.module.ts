import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { JwtInterceptor } from '@interceptors/jwt.interceptor';
import { ServerErrorInterceptor } from '@interceptors/server-error.interceptor';
import { MsalInterceptor, MsalModule } from '@azure/msal-angular'
import { InteractionType, PublicClientApplication } from '@azure/msal-browser'
import { azureConfig, isAddAuth } from '@app/app.constants'

export const azureModules = isAddAuth ? [
  MsalModule.forRoot(
    new PublicClientApplication(azureConfig),
    {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
      }
    },
    {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
        [`${'http://localhost:8002'}/*`, ['user.read']]
      ])
    })
] : []

export const authInterceptors = isAddAuth ? [
  { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
] : [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ...azureModules
  ],
  providers: [
    authInterceptors,
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
