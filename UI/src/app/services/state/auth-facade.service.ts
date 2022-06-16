import { Inject, Injectable } from '@angular/core';
import { authInjector } from '@services/auth/auth-injector';
import { AuthService } from '@services/auth/auth.service';
import { ResetStateService } from '@services/state/reset-state.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthFacadeService {

  get userInitials(): string {
    const user = this.authService.user
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    } else if (user?.firstName) {
      return user.firstName[0]
    } else {
      return '?'
    }
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
