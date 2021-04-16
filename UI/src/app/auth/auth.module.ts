import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthBackgroundComponent } from './auxiliary/auth-background/auth-background.component';
import { AuthLogoComponent } from './auxiliary/auth-logo/auth-logo.component';
import { ValidateMessageComponent } from './auxiliary/validate-message/validate-message.component';
import { AuthErrorMessageComponent } from './auxiliary/auth-error-message/auth-error-message.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { AuthPasswordInputComponent } from './auxiliary/auth-password-input/auth-password-input.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthStateService } from './auth-state.service';
import { AlreadyRegisteredComponent } from './already-registered/already-registered.component';
import { LinkExpiredComponent } from './link-expired/link-expired.component';

@NgModule({
  declarations: [
    SignInComponent,
    AuthBackgroundComponent,
    AuthLogoComponent,
    ValidateMessageComponent,
    AuthErrorMessageComponent,
    SignOutComponent,
    AuthPasswordInputComponent,
    RecoverPasswordComponent,
    ResetPasswordComponent,
    AlreadyRegisteredComponent,
    LinkExpiredComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthStateService
  ]
})
export class AuthModule { }
