import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComfyComponent } from './components/comfy/comfy.component';
import { MappingComponent } from './components/pages/mapping/mapping.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/comfy',
    pathMatch: 'full'
  },
  { path: 'comfy', component: ComfyComponent },
  { path: 'mapping', component: MappingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
