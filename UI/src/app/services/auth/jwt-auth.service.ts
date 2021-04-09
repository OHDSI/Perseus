import { Injectable } from '@angular/core';
import { AuthService, localStorageUserField } from './auth.service';
import { User } from '../../models/user';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl, loginRouter } from '../../app.constants';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JwtAuthService implements AuthService {

  private currentUser$: BehaviorSubject<User>;

  constructor(private httpClient: HttpClient, private router: Router) {
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
    return this.httpClient.post<User>(`${apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(user => {
        localStorage.setItem(localStorageUserField, JSON.stringify(user))
        this.currentUser$.next(user)
      })
    )
  }

  logout(): Observable<void> {
    return this.httpClient.get<void>(`${apiUrl}/logout`)
      .pipe(
        tap(() => {
          localStorage.removeItem(localStorageUserField)
          this.currentUser$.next(null)
          this.router.navigateByUrl(loginRouter)
        })
      )
  }

  register(user: User): Observable<void> {
    return this.httpClient.post<void>(`${apiUrl}/register`, user)
  }
}
