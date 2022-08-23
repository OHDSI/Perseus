import { authStrategy, isAddAuth, isDev, serverUrl } from '@app/app.constants'
import { OAuthModule } from 'angular-oauth2-oidc'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { UsernameInterceptor } from '@interceptors/username.interceptor'
import { JwtInterceptor } from '@interceptors/jwt.interceptor'
import { AuthStrategies } from '../environments/auth-strategies'
import { AddInterceptor } from '@interceptors/add.interceptor'

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
  switch (authStrategy) {
    case AuthStrategies.ADD:
      return [
        {provide: HTTP_INTERCEPTORS, useClass: AddInterceptor, multi: true}
      ]
    case AuthStrategies.SMTP:
      return [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      ]
    case AuthStrategies.FAKE:
      return [
        {provide: HTTP_INTERCEPTORS, useClass: UsernameInterceptor, multi: true}
      ]
    default:
      throw Error('Unsupported auth strategy')
  }
}

export function getAddAllowedUrls(): string[] {
  const result = [serverUrl]
  if (isDev) {
    result.push('http://localhost')
    result.push('http://localhost:4200')
  }
  return result;
}
