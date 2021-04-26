import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrettyNamePipe } from './pipes/pretty-name.pipe';
import { TypeToIconPipe } from './pipes/type-to-icon.pipe';
import { SearchByNameComponent } from './search-by-name/search-by-name.component';
import { CdmCustomMaterialModule } from '../material/cdm-custom-material.module';
import { CloseDialogButtonComponent } from './close-dialog-button/close-dialog-button.component';
import { HintComponent } from './hint/hint.component';
import { HintOverlayComponent } from './hint/hint-overlay/hint-overlay.component';

@NgModule({
  declarations: [
    PrettyNamePipe,
    TypeToIconPipe,
    SearchByNameComponent,
    CloseDialogButtonComponent,
    HintComponent,
    HintOverlayComponent
  ],
  exports: [
    CommonModule,
    CdmCustomMaterialModule,
    PrettyNamePipe,
    TypeToIconPipe,
    SearchByNameComponent,
    CloseDialogButtonComponent,
    HintComponent
  ],
  imports: [
    CommonModule,
    CdmCustomMaterialModule
  ]
})
export class SharedModule { }

