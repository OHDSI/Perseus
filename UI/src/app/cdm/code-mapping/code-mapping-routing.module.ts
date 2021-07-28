import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImportCodesComponent } from './import-codes/import-codes.component';
import { MappingCodesGuard } from '@guards/code-mapping/mapping-codes.guard';
import { MappingCodesComponent } from './mapping-codes/mapping-codes.component';
import { ImportCodesGuard } from '@guards/code-mapping/import-codes.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ImportCodesGuard],
    component: ImportCodesComponent,
    data: { breadcrumb: 'Import codes' }
  },
  {
    path: 'mapping',
    canActivate: [MappingCodesGuard],
    component: MappingCodesComponent,
    data: { breadcrumb: 'Mapping codes' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodeMappingRoutingModule {
}
