import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { User } from '../../models/user';
import { AuthService, localStorageUserField } from './auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FakeAuthService implements AuthService {

  private currentUser$: BehaviorSubject<User>

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

  login(email: string, password: string): Observable<User> {
    return of({
      email,
      token: Math.random().toString(36).substring(7)
    }).pipe(
      delay(2000),
      tap(user => {
        localStorage.setItem(localStorageUserField, JSON.stringify(user))
        this.currentUser$.next(user)
      })
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
}
