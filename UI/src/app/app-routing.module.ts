import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: `login`,
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module')
      .then(module => module.LoginModule)
  },
  {
    path: `comfy`,
    loadChildren: () => import('./comfy/comfy.module')
      .then(module => module.ComfyModule)
  },
  {
    path: `mapping`,
    loadChildren: () => import('./mapping/mapping.module')
      .then(module => module.MappingModule)
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
