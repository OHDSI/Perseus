import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { User } from '../../models/user';
import { AuthService, localStorageUserField } from './auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FakeAuthService implements AuthService {

  private currentUser$: BehaviorSubject<User>

  private readonly delay = 2000;

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

  login(email: string, password: string, ): Observable<User> {
    return this.saveUser(
      of({email, token: this.token(), refresh_token: this.token()}).pipe(delay(this.delay))
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
    return this.saveUser(
      of({email, token: this.token(), refresh_token: this.token()}).pipe(delay(this.delay))
    ).pipe(
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
