import { SignInComponent } from './sign-in/sign-in.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SignOutComponent } from './sign-out/sign-out.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AlreadyRegisteredGuard } from '@guards/auth/already-registered.guard';
import { AlreadyRegisteredComponent } from './already-registered/already-registered.component';
import { LinkExpiredComponent } from './link-expired/link-expired.component';
import { LinkExpiredGuard } from '@guards/auth/link-expired.guard';
import { ResetPasswordGuard } from '@guards/auth/reset-password.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in'
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'sign-out',
    component: SignOutComponent
  },
  {
    path: 'recover-password',
    component: RecoverPasswordComponent
  },
  {
    path: 'reset-password',
    canActivate: [ResetPasswordGuard],
    component: ResetPasswordComponent
  },
  {
    path: 'already-registered',
    canActivate: [AlreadyRegisteredGuard],
    component: AlreadyRegisteredComponent
  },
  {
    path: 'link-expired',
    canActivate: [LinkExpiredGuard],
    component: LinkExpiredComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
