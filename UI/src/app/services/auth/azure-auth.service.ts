import { AuthService } from '@services/auth/auth.service'
import { User } from '@models/auth/user'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { authApiUrl } from '@app/app.constants'
import { catchError, map } from 'rxjs/operators'
import { OAuthService } from 'angular-oauth2-oidc'
import { authConfig } from '@app/auth.config'
import { fromPromise } from 'rxjs/internal-compatibility'
import { TokenResponse } from 'angular-oauth2-oidc/types'
import { Injectable } from '@angular/core'

@Injectable()
export class AzureAuthService implements AuthService {
  loggedIn = false
  user: User | null = null
  firstLogin = true

  constructor(private httpClient: HttpClient,
              private oauthService: OAuthService) {
    this.oauthService.configure(authConfig)
  }

  get isUserLoggedIn$(): Observable<boolean> {
    if (this.loggedIn) {
      return of(true)
    }
    return this.httpClient.get<User>(`${authApiUrl}/user`)
      .pipe(
        map(user => {
          this.loggedIn = true;
          this.user = user
          this.oauthService.setupAutomaticSilentRefresh()
          return true
        })
      )
  }

  get isUserLoggedIn(): boolean {
    return this.loggedIn || !!this.oauthService.getRefreshToken()
  }

  login(): Observable<boolean> {
    this.firstLogin = false
    return fromPromise(this.oauthService.loadDiscoveryDocumentAndLogin())
  }

  logout(): Observable<void> {
    this.oauthService.logOut()
    this.resetUserInfo()
    return of(null)
  }

  refreshToken(): Observable<TokenResponse> {
    return fromPromise(this.oauthService.refreshToken())
      .pipe(
        catchError(error => {
          this.resetUserInfo()
          sessionStorage.clear()
          throw error
        })
      )
  }

  recoverPassword(email: string): Observable<void> {
    throw new Error('Not supported')
  }

  register(user: User): Observable<void> {
    throw new Error('Not supported')
  }

  resetPassword(password: string, token: string): Observable<void> {
    throw new Error('Not supported')
  }

  private resetUserInfo(): void {
    this.user = null
    this.loggedIn = false
  }
}
