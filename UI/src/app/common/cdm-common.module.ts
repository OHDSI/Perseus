import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrettyNamePipe } from './pipes/pretty-name.pipe';
import { TypeToIconPipe } from './pipes/type-to-icon.pipe';
import { PrettyXmlPipe } from './pipes/pretty-xml.pipe';
import { SearchByNameComponent } from './search-by-name/search-by-name.component';
import { CdmCustomMaterialModule } from './cdm-custom-material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CloseDialogButtonComponent } from './close-dialog-button/close-dialog-button.component';

@NgModule({
  declarations: [
    PrettyNamePipe,
    TypeToIconPipe,
    PrettyXmlPipe,
    SearchByNameComponent,
    CloseDialogButtonComponent
  ],
  exports: [
    PrettyNamePipe,
    TypeToIconPipe,
    PrettyXmlPipe,
    SearchByNameComponent,
    CdmCustomMaterialModule,
    NgxMatSelectSearchModule,
    CloseDialogButtonComponent
  ],
  imports: [
    CommonModule,
    CdmCustomMaterialModule,
    NgxMatSelectSearchModule,
  ]
})
export class CdmCommonModule { }

