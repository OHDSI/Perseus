import { User } from '@models/auth/user';
import { Observable } from 'rxjs';
import { TokenResponse } from 'angular-oauth2-oidc/types'

export interface AuthService {
  firstLogin?: boolean

  user: User

  isUserLoggedIn: boolean

  isUserLoggedIn$: Observable<boolean>

  login(email?: string, password?: string): Observable<boolean | User>

  logout(): Observable<void>

  register(user: User): Observable<void>

  recoverPassword(email: string): Observable<void>

  resetPassword(password: string, token: string): Observable<void>

  refreshToken(email?: string, token?: string): Observable<User | TokenResponse>
}

export const localStorageUserField = 'currentUser'
