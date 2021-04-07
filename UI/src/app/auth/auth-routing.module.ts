import { SignInComponent } from './sign-in/sign-in.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SignOutComponent } from './sign-out/sign-out.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
