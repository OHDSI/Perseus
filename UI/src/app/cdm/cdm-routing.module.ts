import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CdmComponent } from './cdm.component';
import { MappingGuard } from '@guards/mapping/mapping.guard';
import { AuthGuard } from '@guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CdmComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'comfy',
        pathMatch: 'full'
      },
      {
        path: `comfy`,
        loadChildren: () => import('./comfy/comfy.module')
          .then(module => module.ComfyModule)
      },
      {
        path: `mapping`,
        canLoad: [MappingGuard],
        canActivate: [MappingGuard],
        loadChildren: () => import('./mapping/mapping.module')
          .then(module => module.MappingModule)
      },
      {
        path: 'codes',
        loadChildren: () => import('./code-mapping/code-mapping.module')
          .then(module => module.CodeMappingModule)
      },
      {
        path: '**',
        redirectTo: '/comfy'
      },
    ]
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CdmRoutingModule { }
