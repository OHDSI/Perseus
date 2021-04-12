import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrettyNamePipe } from './pipes/pretty-name.pipe';
import { TypeToIconPipe } from './pipes/type-to-icon.pipe';
import { SearchByNameComponent } from './search-by-name/search-by-name.component';
import { CdmCustomMaterialModule } from '../../material/cdm-custom-material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CloseDialogButtonComponent } from './close-dialog-button/close-dialog-button.component';
import { GreyLogoComponent } from './grey-logo/grey-logo.component';

@NgModule({
  declarations: [
    PrettyNamePipe,
    TypeToIconPipe,
    SearchByNameComponent,
    CloseDialogButtonComponent,
    GreyLogoComponent
  ],
  exports: [
    PrettyNamePipe,
    TypeToIconPipe,
    SearchByNameComponent,
    CdmCustomMaterialModule,
    NgxMatSelectSearchModule,
    CloseDialogButtonComponent,
    GreyLogoComponent
  ],
  imports: [
    CommonModule,
    CdmCustomMaterialModule,
    NgxMatSelectSearchModule
  ]
})
export class CdmCommonModule { }

