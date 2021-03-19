import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImportCodesComponent } from './import-codes/import-codes.component';

const routes: Routes = [
  {
    path: '',
    component: ImportCodesComponent,
    data: { breadcrumb: 'Import codes' }
  },
  {
    path: 'mapping',
    component: ImportCodesComponent,
    data: { breadcrumb: 'Mapping' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodeMappingRoutingModule {
}
