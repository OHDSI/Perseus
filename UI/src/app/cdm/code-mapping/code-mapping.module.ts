import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportCodesComponent } from './import-codes/import-codes.component';
import { MappingCodesComponent } from './mapping-codes/mapping-codes.component';
import { CodeMappingRoutingModule } from './code-mapping-routing.module';
import { CdmCommonModule } from '../../common/cdm-common.module';

@NgModule({
  declarations: [ImportCodesComponent, MappingCodesComponent],
  imports: [
    CommonModule,
    CodeMappingRoutingModule,
    CdmCommonModule
  ]
})
export class CodeMappingModule { }
