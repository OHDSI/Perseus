import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthBackgroundComponent } from './auxiliary/auth-background/auth-background.component';
import { AuthLogoComponent } from './auxiliary/auth-logo/auth-logo.component';
import { ValidateMessageComponent } from './auxiliary/validate-message/validate-message.component';
import { AuthErrorMessageComponent } from './auxiliary/auth-error-message/auth-error-message.component';

@NgModule({
  declarations: [
    SignInComponent,
    AuthBackgroundComponent,
    AuthLogoComponent,
    ValidateMessageComponent,
    AuthErrorMessageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
