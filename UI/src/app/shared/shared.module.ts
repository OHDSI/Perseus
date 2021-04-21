import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrettyNamePipe } from './pipes/pretty-name.pipe';
import { TypeToIconPipe } from './pipes/type-to-icon.pipe';
import { SearchByNameComponent } from './search-by-name/search-by-name.component';
import { CdmCustomMaterialModule } from '../material/cdm-custom-material.module';
import { CloseDialogButtonComponent } from './close-dialog-button/close-dialog-button.component';

@NgModule({
  declarations: [
    PrettyNamePipe,
    TypeToIconPipe,
    SearchByNameComponent,
    CloseDialogButtonComponent
  ],
  exports: [
    CommonModule,
    CdmCustomMaterialModule,
    PrettyNamePipe,
    TypeToIconPipe,
    SearchByNameComponent,
    CloseDialogButtonComponent
  ],
  imports: [
    CommonModule,
    CdmCustomMaterialModule
  ]
})
export class SharedModule { }

