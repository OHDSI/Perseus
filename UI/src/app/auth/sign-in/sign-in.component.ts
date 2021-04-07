import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { authInjector } from '../../services/auth/auth-injector';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { parseHttpError } from '../../services/utilites/error';
import { mainPageRouter } from '../../app.constants';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  form: FormGroup

  error: string

  loading = false

  constructor(@Inject(authInjector) private authService: AuthService,
              private router: Router) {
  }

  get email() {
    return this.form.get('email')
  }

  ngOnInit(): void {
    this.initForm()
  }

  onSubmit() {
    this.loading = true
    const {email, password} = this.form.value
    this.authService.login(email, password)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        () => this.router.navigate([mainPageRouter]),
        error => this.error = parseHttpError(error) ?? 'Incorrect login or password'
      )
  }

  private initForm() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    })
  }
}
