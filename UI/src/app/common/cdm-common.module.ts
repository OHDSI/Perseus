import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrettyNamePipe } from './pipes/pretty-name.pipe';
import { TypeToIconPipe } from './pipes/type-to-icon.pipe';
import { PrettyXmlPipe } from './pipes/pretty-xml.pipe';
import { BaseComponent } from './components/base/base.component';
import { SearchByNameComponent } from './components/search-by-name/search-by-name.component';
import { CdmCustomMaterialModule } from './cdm-custom-material.module';

@NgModule({
  declarations: [
    PrettyNamePipe,
    TypeToIconPipe,
    PrettyXmlPipe,
    BaseComponent,
    SearchByNameComponent
  ],
  exports: [
    PrettyNamePipe,
    TypeToIconPipe,
    PrettyXmlPipe,
    BaseComponent,
    SearchByNameComponent,
    CdmCustomMaterialModule
  ],
  imports: [
    CommonModule,
    CdmCustomMaterialModule
  ]
})
export class CdmCommonModule { }

