import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddConstantPopupComponent } from './add-constant-popup/add-constant-popup.component';
import { CdmVersionDialogComponent } from './cdm-version-dialog/cdm-version-dialog.component';
import { CommentPopupComponent } from './comment-popup/comment-popup.component';
import { DeleteWarningComponent } from './delete-warning/delete-warning.component';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { OnBoardingComponent } from './on-boarding/on-boarding.component';
import { CdmFilterComponent } from './cdm-filter/cdm-filter.component';
import { OpenSaveDialogComponent } from './open-save-dialog/open-save-dialog.component';
import { PreviewPopupComponent } from './preview-popup/preview-popup.component';
import { PrismComponent } from './preview-popup/prism.component';
import { ResetWarningComponent } from './reset-warning/reset-warning.component';
import { RulesPopupComponent } from './rules-popup/rules-popup.component';
import { TransformationInputComponent } from './rules-popup/transformation-input/transformation-input.component';
import { SelectConceptFieldComponent } from './select-concept-field/select-concept-field.component';
import { SelectTableDropdownComponent } from './select-table-dropdown/select-table-dropdown.component';
import { SetConnectionTypePopupComponent } from './set-connection-type-popup/set-connection-type-popup.component';
import { CdmCommonModule } from '../common/cdm-common.module';
import { TransformationTypeComponent } from './transformation-type/transformation-type.component';
import { SqlFunctionsInjector } from './rules-popup/model/sql-functions-injector';
import { SQL_FUNCTIONS } from './rules-popup/transformation-input/model/sql-string-functions';
import { LogoutComponent } from './logout/logout.component';
import { HelpPopupComponent } from './help-popup/help-popup.component';

@NgModule({
  declarations: [
    AddConstantPopupComponent,
    CdmVersionDialogComponent,
    CommentPopupComponent,
    DeleteWarningComponent,
    ErrorPopupComponent,
    OnBoardingComponent,
    CdmFilterComponent,
    OpenSaveDialogComponent,
    PreviewPopupComponent,
    PrismComponent,
    ResetWarningComponent,
    RulesPopupComponent,
    TransformationInputComponent,
    SelectConceptFieldComponent,
    SelectTableDropdownComponent,
    SetConnectionTypePopupComponent,
    TransformationTypeComponent,
    LogoutComponent,
    HelpPopupComponent
  ],
  imports: [
    CommonModule,
    CdmCommonModule
  ],
  exports: [
    AddConstantPopupComponent,
    CdmVersionDialogComponent,
    CommentPopupComponent,
    DeleteWarningComponent,
    ErrorPopupComponent,
    OnBoardingComponent,
    CdmFilterComponent,
    OpenSaveDialogComponent,
    PreviewPopupComponent,
    PrismComponent,
    ResetWarningComponent,
    RulesPopupComponent,
    TransformationInputComponent,
    SelectConceptFieldComponent,
    SelectTableDropdownComponent,
    SetConnectionTypePopupComponent,
    TransformationTypeComponent
  ],
  providers: [
    { provide: SqlFunctionsInjector, useValue: SQL_FUNCTIONS }
  ]
})
export class PopupsModule { }
