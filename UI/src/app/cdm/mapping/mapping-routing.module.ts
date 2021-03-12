import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MappingComponent } from './mapping.component';

const routes: Routes = [
  {
    path: '',
    component: MappingComponent,
    data: { breadcrumb: 'Link Fields' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MappingRoutingModule {
}
