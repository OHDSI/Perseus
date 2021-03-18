import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './login/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: 'perseus',
    canActivate: [AuthGuard],
    loadChildren: () => import('./cdm/cdm.module')
      .then(module => module.CdmModule),
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./login/login.module')
      .then(module => module.LoginModule)
  },
  {
    path: '**',
    redirectTo: 'sign-in'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
