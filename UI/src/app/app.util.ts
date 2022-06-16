import { isAddAuth, isDev, serverUrl } from '@app/app.constants'
import { OAuthModule } from 'angular-oauth2-oidc'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { UsernameInterceptor } from '@interceptors/username.interceptor'
import { JwtInterceptor } from '@interceptors/jwt.interceptor'

export function getAuthModules(): any[] {
  return isAddAuth ? [
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: getAddAllowedUrls(),
        sendAccessToken: true
      }
    }),
  ] : []
}

export function getAuthInterceptors(): any[] {
  if (isAddAuth) {
    return isDev ? [
      {provide: HTTP_INTERCEPTORS, useClass: UsernameInterceptor, multi: true}
    ] : []
  } else {
    return [
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ]
  }
}

export function getAddAllowedUrls(): string[] {
  const result = [serverUrl]
  if (isDev) {
    result.push('http://localhost')
  }
  return result;
}
