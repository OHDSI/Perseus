import { OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

export abstract class AuthComponent implements OnInit {

  form: FormGroup

  error: string

  loading = false

  protected constructor(protected authService: AuthService,
                        protected router: Router) {
  }

  ngOnInit(): void {
    this.initForm()
  }

  abstract submit(): void

  protected abstract initForm(): void
}
