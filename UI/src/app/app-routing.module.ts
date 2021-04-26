import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';
import { AlreadyLoggedInGuard } from './services/auth/already-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AlreadyLoggedInGuard],
    loadChildren: () => import('./auth/auth.module')
      .then(module => module.AuthModule)
  },
  {
    path: 'perseus',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    loadChildren: () => import('./cdm/cdm.module')
      .then(module => module.CdmModule),
  },
  {
    path: '**',
    redirectTo: 'perseus'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
