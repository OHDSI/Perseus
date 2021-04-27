import { OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';

export abstract class AuthComponent extends BaseComponent implements OnInit {

  form: FormGroup

  error: string

  loading = false

  protected constructor(protected authService: AuthService,
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
