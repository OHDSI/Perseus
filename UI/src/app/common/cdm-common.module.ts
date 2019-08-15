
import { NgModule } from '@angular/core';
import { PrettyNamePipe } from './pipes/pretty-name.pipe';
import { TypeToIconPipe } from './pipes/type-to-icon.pipe';
import { PrettyXmlPipe } from './pipes/pretty-xml.pipe';

@NgModule({
  declarations: [
    PrettyNamePipe,
    TypeToIconPipe,
    PrettyXmlPipe
  ],
  exports: [
    PrettyNamePipe,
    TypeToIconPipe,
    PrettyXmlPipe
  ],
})
export class CdmCommonModule { }

