import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComfyComponent } from './components/comfy/comfy.component';
import { MappingComponent } from './components/pages/mapping/mapping.component';
import { environment } from '../environments/environment';

const {prefix: prefix, initialPath: initialPath} = environment;
const routes: Routes = [
  {
    path: `${initialPath}`,
    redirectTo: `/${prefix}comfy`,
    pathMatch: 'full'
  },
  {
    path: `${prefix}comfy`,
    component: ComfyComponent,
    data: { breadcrumb: 'Link Tables' },
    children: [ {
      path: `${prefix}mapping`,
      component: MappingComponent,
      data: { breadcrumb: 'Link Fields' }
    } ]
  },
  { path: `${prefix}mapping`, component: MappingComponent, data: { breadcrumb: 'Link Fields' } }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
