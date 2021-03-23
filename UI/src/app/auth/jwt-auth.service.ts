import { Injectable } from '@angular/core';
import { AuthService, localStorageUserField } from './auth.service';
import { User } from '../models/user';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../app.constants';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtAuthService implements AuthService {

  private currentUser$: BehaviorSubject<User>;

  constructor(private httpClient: HttpClient) {
    const user = JSON.parse(localStorage.getItem(localStorageUserField))
    this.currentUser$ = new BehaviorSubject<User>(user)
  }

  get user(): User {
    return this.currentUser$.getValue()
  }

  get isUserLoggedIn(): boolean {
    return !!this.user?.token;
  }

  login(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>(`${apiUrl}/login`, {
      username,
      password
    }).pipe(
      tap(user => {
        localStorage.setItem(localStorageUserField, JSON.stringify(user))
        this.currentUser$.next(user)
      })
    )
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          localStorage.removeItem(localStorageUserField);
          this.currentUser$.next(null);
        })
      )
  }
}
