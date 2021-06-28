import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';
import { authInjector } from '@services/auth/auth-injector';

@Component({
  template: ''
})
export abstract class AuthComponent extends BaseComponent implements OnInit {

  form: FormGroup

  error: string

  loading = false

  protected constructor(@Inject(authInjector) protected authService: AuthService,
                        protected router: Router) {
    super()
  }

  ngOnInit(): void {
    this.initForm()
  }

  abstract submit(): void

  protected abstract initForm(): void

  protected sendRequestAndShowLoading<T>(request: Observable<T>): Observable<T> {
    this.loading = true
    return request.pipe(
      finalize(() => this.loading = false)
    )
  }
}
