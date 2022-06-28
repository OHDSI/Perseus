import { authStrategy, isAddAuth, isDev, serverUrl } from '@app/app.constants'
import { OAuthModule } from 'angular-oauth2-oidc'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { UsernameInterceptor } from '@interceptors/username.interceptor'
import { JwtInterceptor } from '@interceptors/jwt.interceptor'
import { AuthStrategies } from '../environments/auth-strategies'

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
      return isDev ? [
        {provide: HTTP_INTERCEPTORS, useClass: UsernameInterceptor, multi: true}
      ] : []
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
  }
  return result;
}
