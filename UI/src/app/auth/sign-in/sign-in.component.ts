import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { authInjector } from '../auth-injector';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { parseHttpError } from '../../services/utilites/error';
import { mainPageRouter } from '../../app.constants';

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
              private router: Router) { }

  ngOnInit(): void {
    this.initForm()
  }

  onSubmit() {
    this.loading = true
    const {username, password} = this.form.value
    this.authService.login(username, password)
      .subscribe(() =>
        this.router.navigate([mainPageRouter]),
        error => {
          this.error = parseHttpError(error)
          this.loading = false
        }
      )
  }

  private initForm() {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })
  }
}
