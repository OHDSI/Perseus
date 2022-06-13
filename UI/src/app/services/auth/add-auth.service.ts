import { Injectable } from '@angular/core'
import { AuthService } from '@services/auth/auth.service'
import { User } from '@models/auth/user'
import { Observable, of } from 'rxjs'
import { MsalService } from '@azure/msal-angular'
import { HttpClient } from '@angular/common/http'
import { authApiUrl } from '@app/app.constants'
import { catchError, map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AddAuthService implements AuthService {
  isUserLoggedIn = false
  user: User

  constructor(private msalService: MsalService,
              private httpClient: HttpClient) {
  }

  get isUserLoggedIn$(): Observable<boolean> {
    return this.httpClient.get(authApiUrl)
      .pipe(
        map(() => true),
        catchError(() => of(false))
      )
  }

  login(): Observable<User> {
    return this.msalService.loginPopup()
      .pipe(
        map(result => ({
          username: result.account.username,
          email: result.account.username
        })),
        tap(user => {
          this.user = user
          this.isUserLoggedIn = true
        })
      )
  }

  logout(): Observable<void> {
    return this.msalService.logout()
      .pipe(
        tap(() => {
          this.user = null
          this.isUserLoggedIn = false
        })
      )
  }

  recoverPassword(email: string): Observable<void> {
    throw new Error('Not supported')
  }

  refreshToken(email, token): Observable<User> {
    throw new Error('Not supported')
  }

  register(user: User): Observable<void> {
    throw new Error('Not supported')
  }

  reset(password: string, token: string): Observable<void> {
    throw new Error('Not supported')
  }
}
