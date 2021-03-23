import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportCodesComponent } from './import-codes/import-codes.component';
import { MappingCodesComponent } from './mapping-codes/mapping-codes.component';
import { CodeMappingRoutingModule } from './code-mapping-routing.module';
import { CdmCommonModule } from '../../common/cdm-common.module';
import { ImportVocabularyComponent } from './import-codes/import-vocabulary/import-vocabulary.component';
import { ImportVocabularyButtonsComponent } from './import-codes/import-vocabulary/import-vocabulary-buttons/import-vocabulary-buttons.component';

@NgModule({
  declarations: [ImportCodesComponent, MappingCodesComponent, ImportVocabularyComponent, ImportVocabularyButtonsComponent],
  imports: [
    CommonModule,
    CodeMappingRoutingModule,
    CdmCommonModule
  ]
})
export class CodeMappingModule { }
