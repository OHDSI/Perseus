import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '@models/auth/user';
import { AuthService, localStorageUserField } from './auth.service';
import { catchError, delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FakeAuthService implements AuthService {

  private currentUser$: BehaviorSubject<User>

  private readonly delay = 1500;

  constructor() {
    const user = JSON.parse(localStorage.getItem(localStorageUserField))
    this.currentUser$ = new BehaviorSubject<User>(user)
  }

  get user(): User {
    return this.currentUser$.getValue()
  }

  get isUserLoggedIn(): boolean {
    return !!this.user?.token;
  }

  get isUserLoggedIn$(): Observable<boolean> {
    return of(this.isUserLoggedIn);
  }

  login(email: string, password: string, ): Observable<User> {
    const user = {
      username: email
        .replace('@', '_at_')
        .replace('.', '_'),
      email,
      token: this.token(),
      refresh_token: this.token()
    }
    return this.saveUser(
      of(user).pipe(delay(this.delay))
    )
  }

  logout(): Observable<void> {
    return of(null)
      .pipe(
        tap(() => {
          localStorage.removeItem(localStorageUserField);
          this.currentUser$.next(null);
        })
      )
  }

  register(user: User): Observable<void> {
    return of(null).pipe(delay(this.delay))
  }

  recoverPassword(email: string): Observable<void> {
    return of(null).pipe(delay(this.delay))
  }

  reset(password: string, token: string): Observable<void> {
    return of(null).pipe(delay(this.delay))
  }

  refreshToken(email, token): Observable<User> {
    const user = {
      username: email,
      email,
      token: this.token(),
      refresh_token: this.token()
    }
    const user$ = of(user).pipe(delay(this.delay))
    return this.saveUser(user$)
      .pipe(
        catchError(error => {
          localStorage.removeItem(localStorageUserField)
          this.currentUser$.next(null)
          throw error
        })
      )
  }

  private token = () => Math.random().toString(36).substring(7)

  private saveUser(request$: Observable<User>): Observable<User> {
    return request$
      .pipe(
        tap(user => {
          localStorage.setItem(localStorageUserField, JSON.stringify(user))
          this.currentUser$.next(user)
        })
      )
  }
}
