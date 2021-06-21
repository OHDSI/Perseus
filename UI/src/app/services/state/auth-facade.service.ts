import { Inject, Injectable } from '@angular/core';
import { authInjector } from '@services/auth/auth-injector';
import { AuthService } from '@services/auth/auth.service';
import { ResetStateService } from '@services/state/reset-state.service';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthFacadeService {

  get userInitials() {
    const {firstName = '?', lastName = '?'} = this.authService.user
    return `${firstName[0]}${lastName[0]}`
  }

  constructor(@Inject(authInjector) private authService: AuthService,
              private resetStateService: ResetStateService) {
  }

  logout(): Observable<void> {
    return this.authService.logout()
      .pipe(
        tap(() => this.resetStateService.resetAppState())
      )
  }
}
