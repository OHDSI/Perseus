import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrettyNamePipe } from './pipes/pretty-name.pipe';
import { TypeToIconPipe } from './pipes/type-to-icon.pipe';
import { TypeofPipe } from './pipes/typeof.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { SearchByNameComponent } from './search-by-name/search-by-name.component';
import { CdmCustomMaterialModule } from '../material/cdm-custom-material.module';
import { CloseDialogButtonComponent } from './close-dialog-button/close-dialog-button.component';
import { HintComponent } from './hint/hint.component';
import { HintOverlayComponent } from './hint/hint-overlay/hint-overlay.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { CdmCheckboxComponent } from './cdm-checkbox/cdm-checkbox.component';
import { CdkTableModule } from '@angular/cdk/table';
import { SetDelimiterDialogComponent } from './set-delimiter-dialog/set-delimiter-dialog.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { FilterDropdownLabelComponent } from './filters/filter-dropdown/filter-dropdown-label/filter-dropdown-label.component';
import { FilterListComponent } from './filters/filter-dropdown/filter-list/filter-list.component';
import { FilterDropdownComponent } from './filters/filter-dropdown/filter-dropdown.component';
import { FilterColorPointComponent } from './filters/filter-color-point/filter-color-point.component';
import { TextWidthDirective } from './text-width/text-width.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SqlEditorComponent } from '@shared/sql-editor/sql-editor.component';
import { WarningHintComponent } from '@shared/hint/warning-hint/warning-hint.component';
import { PersonMappingWarningDialogComponent } from '@shared/person-mapping-warning-dialog/person-mapping-warning-dialog.component'
import { PopupComponent } from './popup/popup.component'

@NgModule({
  declarations: [
    PrettyNamePipe,
    TypeToIconPipe,
    TypeofPipe,
    FormatDatePipe,
    CapitalizePipe,
    SearchByNameComponent,
    CloseDialogButtonComponent,
    HintComponent,
    HintOverlayComponent,
    CdmCheckboxComponent,
    SetDelimiterDialogComponent,
    SearchInputComponent,
    FilterDropdownLabelComponent,
    FilterListComponent,
    FilterDropdownComponent,
    FilterColorPointComponent,
    TextWidthDirective,
    SqlEditorComponent,
    WarningHintComponent,
    PersonMappingWarningDialogComponent,
    PopupComponent,
  ],
  exports: [
    CommonModule,
    CdmCustomMaterialModule,
    NgxTrimDirectiveModule,
    PrettyNamePipe,
    TypeToIconPipe,
    TypeofPipe,
    FormatDatePipe,
    CapitalizePipe,
    SearchByNameComponent,
    CloseDialogButtonComponent,
    HintComponent,
    CdmCheckboxComponent,
    CdkTableModule,
    SearchInputComponent,
    FilterDropdownComponent,
    FilterColorPointComponent,
    TextWidthDirective,
    FormsModule,
    ReactiveFormsModule,
    SqlEditorComponent,
    WarningHintComponent,
    PersonMappingWarningDialogComponent,
    PopupComponent,
  ],
  imports: [
    CommonModule,
    CdmCustomMaterialModule,
    NgxTrimDirectiveModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}

