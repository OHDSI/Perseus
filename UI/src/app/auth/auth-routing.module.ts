import { SignInComponent } from './sign-in/sign-in.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { getSmtpUrls } from '@app/auth/auth-util'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in'
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  ...getSmtpUrls()
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
