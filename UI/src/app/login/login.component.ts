import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { authInjector } from './auth-injector';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { parseHtmlError } from '../services/utilites/error';
import { mainPageRouter } from '../app.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup

  error: string

  loading = false

  constructor(@Inject(authInjector) private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm()
  }

  onSubmit() {
    this.loading = true
    const user: User = this.form.value
    this.authService.login(user.login, user.password)
      .subscribe(() =>
        this.router.navigate([mainPageRouter]),
        error => {
          this.error = parseHtmlError(error)
          this.loading = false
        }
      )
  }

  private initForm() {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })
  }
}
